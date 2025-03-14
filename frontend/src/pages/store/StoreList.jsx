import axios from 'axios';
import useKakaoLoader from 'pages/store/useKakaoLoader';
import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

function StoreList(props) {
  const [center, setCenter] = useState(null); // 신한DS 좌표 : { lat: 37.5678148181167, lng: 126.984190577115 }
  const [loading, setLoading] = useState(true); // 지도 로딩 중임을 알려주기 위한 상태 변화
  const [places, setPlaces] = useState([]); // '대형슈퍼' 검색 결과 목록
  const [latlng, setLatLng] = useState(null);

  useKakaoLoader(); // 카카오맵 API Key, library 불러오기

  // 사용자 도로명 주소 정보를 가져와 좌표로 변환
  useEffect(() => {
    axios.get('http://localhost:8888/member/detail')
    .then(response => {
      // 백엔드에서 memberDTO 형태로 반환
      const memberDTO = response.data;
      const roadAddressName = memberDTO.roadAddressName;

      // Kakao Geocoder 사용 (Kakao Maps SDK가 로드된 후에 실행)
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(roadAddressName, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          // 결과 배열의 첫 번째 요소에서 좌표를 추출 (x: 경도, y: 위도)
          const lat = parseFloat(result[0].y);
          const lng = parseFloat(result[0].x);
  
          setCenter({ lat, lng }); // 도로명 주소를 좌표로 변환 후 lat, lng 상태 변화
        } else {
          console.error('주소 좌표 변환 실패:', status);
        }
        setLoading(false);
      });
    })
    .catch(error => {
      console.log('사용자 정보를 불러오는 중 오류 발생: ', error);
      setLoading(false);
    });
  }, []);

  // center 좌표가 설정되면, 반경 1km 내 '대형슈퍼' 키워드로 장소 검색
  useEffect(() => {
    console.log('center : ', center);
    if (center) {
      const ps = new window.kakao.maps.services.Places();
      const searchOptions = {
        location: new window.kakao.maps.LatLng(center.lat, center.lng),
        radius: 1000 // 반경 1km
      };

      ps.keywordSearch('대형슈퍼', (data, status, _pagination) => {
        if (status === window.kakao.maps.services.Status.OK) {
          console.log('검색 결과 데이터 : ', data);
          setPlaces(data);
        } else {
          console.log('장소 검색 실패: ', status);
        }
      }, searchOptions);
    }
  }, [center]);

  if (loading) {
    return <div>지도 로딩 중...</div>;
  }

  return (
    <>
      {center && // center 값이 있으면 아래 코드 수행
      <Map center={center} style={{width: "100%", height: "350px"}} level={5}>
        <MapMarker position={center} image={{src: "/assets/images/marker-home.png", size: {width: 35, height: 35}}} title='우리집'></MapMarker>

        {/* '대형슈퍼' 검색 결과 마커 표시 */}
        {places.map((place, index) => (
          <MapMarker key={index} position={{lat: Number(place.y), lng: Number(place.x)}} image={{src: "/assets/images/marker-market.png", size: {width: 35, height: 35}}} title={place.place_name} />
        ))}
      </Map>}

      {/* 검색 결과 목록으로 표시(DB에서 가져오기!!!) */}
      <div style={{ padding: '1rem' }}>
        <h3>'대형슈퍼' 검색 결과</h3>
        {places.length > 0 ? (
          <ul>
            {places.map((place, index) => (
              <li key={index}>
                <strong>{place.place_name}</strong> - {place.road_address_name || place.address_name}
                <br></br>y : {place.y}, x : {place.x}
              </li>
            ))}
          </ul>
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </>
  );
}

export default StoreList;