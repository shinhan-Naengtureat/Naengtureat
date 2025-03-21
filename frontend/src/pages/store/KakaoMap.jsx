import axiosInstance from "api/axios";
import { STORE_IMAGE_PATH } from "config/pathConfig";
import useKakaoLoader from "pages/store/useKakaoLoader";
import { useEffect, useRef, useState } from "react";
import { Circle, Map, MapMarker } from "react-kakao-maps-sdk";

function KakaoMap({ setPlaces: setParentPlaces }) {
    const [center, setCenter] = useState(null); // 신한DS 좌표 : { lat: 37.5678148181167, lng: 126.984190577115 }
    const [places, setPlaces] = useState([]); // '대형슈퍼' 검색 결과 목록
    const panByExecuted = useRef(false);
    const mapRef = useRef(null); // Kakao Map 인스턴스를 저장할 ref

    useKakaoLoader(); // SDK 로드
    
    // 사용자 도로명 주소 정보를 가져와 좌표로 변환
    useEffect(() => {
        const fetchAndGeocode = async () => {
            try {
                const response = await axiosInstance.get(`/member/detail`);
                const memberDTO = response.data;
                const roadAddressName = memberDTO.roadAddressName;

                const waitForKakao = () => new Promise((resolve) => {
                    const interval = setInterval(() => {
                        if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 300);
                });

                await waitForKakao();

                const geocoder = new window.kakao.maps.services.Geocoder();

                geocoder.addressSearch(roadAddressName, (result, status) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const lat = parseFloat(result[0].y);
                        const lng = parseFloat(result[0].x);

                        setCenter({ lat, lng });
                    } else {
                        console.error('주소 좌표 변환 실패 : ', status);
                    }
                });
            } catch (error) {
                console.log('사용자 정보를 불러오는 중 오류 발생: ', error);
            }
        }

        fetchAndGeocode();
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
        if (center && mapRef.current && !panByExecuted.current) {
            setTimeout(() => {
                mapRef.current.panBy(0, 120); // y 방향으로 120px 이동
                panByExecuted.current = true;
            }, 500);
        }
    }, [center]); // center가 설정될 때 실행

    return (
        <>
            {center === null ? <div>지도 로딩 중...</div> : // center 값이 있으면 아래 코드 수행
                <Map center={center} style={{width: "100%", height: "100%"}} level={6} onCreate={(map) => {
                    mapRef.current = map; // mapRef에 Kakao Map 인스턴스 저장
                }}>
                    <Circle center={center} radius={1000} strokeWeight={2} strokeColor="#ff7f50" strokeOpacity={1} strokeStyle="solid" fillColor="#FFAE00" fillOpacity={0.1}>
                    </Circle>

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