import axiosInstance from "api/axios";
import { API_PATH, STORE_IMAGE_PATH } from "config/pathConfig";
import { useEffect, useRef, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "pages/store/useKakaoLoader";

function KakaoMap({ setPlaces: setParentPlaces }) {
    const [center, setCenter] = useState(null); // 신한DS 좌표 : { lat: 37.5678148181167, lng: 126.984190577115 }
    const [loading, setLoading] = useState(true); // 지도 로딩 중임을 알려주기 위한 상태 변화
    const [places, setPlaces] = useState([]); // '대형슈퍼' 검색 결과 목록
    const panByExecuted = useRef(false);
    const mapRef = useRef(null); // Kakao Map 인스턴스를 저장할 ref

    useKakaoLoader(); // 카카오맵 API Key, library 불러오기

    // 사용자 도로명 주소 정보를 가져와 좌표로 변환
    useEffect(() => {
        axiosInstance.get(`${API_PATH}/member/detail`)
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
                    setParentPlaces && setParentPlaces(data);
                } else {
                    console.log('장소 검색 실패: ', status);
                }
            }, searchOptions);
        }
    }, [center, setParentPlaces]);

    // center가 설정된 후 panBy 실행
    useEffect(() => {
        if (mapRef.current && !panByExecuted.current) {
            mapRef.current.panBy(0, 200); // y 방향으로 200px 이동
            panByExecuted.current = true;
        }
    }, [center]); // center가 설정될 때 실행

    if (loading) {
        return <div>지도 로딩 중...</div>;
    }

    return (
        <>
            {center && // center 값이 있으면 아래 코드 수행
                <Map center={center} style={{width: "100%", height: "100%"}} level={5} onCreate={(map) => {
                    mapRef.current = map; // mapRef에 Kakao Map 인스턴스 저장
                }}>
                    <MapMarker
                        position={center}
                        image={{src: `${STORE_IMAGE_PATH}/marker-home.png`, size: {width: 35, height: 35}}}
                        title='우리집'>
                    </MapMarker>

                    {/* '대형슈퍼' 검색 결과 마커 표시 */}
                    {places.map((place, index) => (
                        <MapMarker 
                            key={index}
                            position={{lat: Number(place.y), lng: Number(place.x)}}
                            image={{src: `${STORE_IMAGE_PATH}/marker-market.png`, size: {width: 35, height: 35}}}
                            title={place.place_name}
                        />
                    ))}
                </Map>
            }
        </>
    );
}

export default KakaoMap;