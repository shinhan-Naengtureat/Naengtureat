import axiosInstance from 'api/axios';
import { API_PATH, STORE_IMAGE_PATH } from 'config/pathConfig';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'styles/store/StoreList.css';

function StoreList({ places }) {
    const [storeList, setStoreList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("places : ", places);

        // places가 없거나 비어있다면 상세 정보 요청하지 않음
        if (!places || places.length === 0) {
            setStoreList([]);
            return;
        }

        const fetchStoreDetails = async () => {
            try {
                // 각 place.id로 API 호출
                const detailPromises = places.map(place =>
                    axiosInstance.get(`${API_PATH}/store/${place.id}/detail`)
                );

                // 병렬 처리, 모든 API 호출(모든 Promise)이 완료될 때까지 기다림
                const responses = await Promise.all(detailPromises);
                const details = responses.map(response => response.data);

                setStoreList(details);
            } catch (error) {
                console.error("스토어 상세 조회 중 오류 발생: ", error);
            }
        };
        
        fetchStoreDetails();
    }, [places]);

    // 스토어 후기 조회
    const reviewHandler = (e, storeId) => {
        e.stopPropagation(); // 클릭 이벤트 버블링 방지

        if (!storeId) {
            console.error("유효하지 않은 storeId:", storeId);
            return;
        }

        navigate(`/store/${storeId}/review`);
    };

    // 스토어 상세 조회
    const detailHandler = (storeId) => {
        if (!storeId) {
            console.error("유효하지 않은 storeId:", storeId);
            return;
        }

        navigate(`/store/${storeId}/detail`);
    };

    if (!storeList || storeList.length === 0) {
        return <div>Loading...</div>;
    };

    return (
        <div>
            {/* 검색 결과 목록 표시 */}
            {storeList.map((store) => (
                <div key={store.id} className='store-detail' onClick={() => detailHandler(store.id)}>
                    <div className="store-info">
                        <span><b>{store.placeName}</b></span><br />
                        <span className="roadAddress">{store.roadAddressName}</span><br />
                        {store.phone && (
                            <span className="phone">
                                <img src={`${STORE_IMAGE_PATH}/telephone.png`} alt="전화기" /> {store.phone}<br />
                            </span>
                        )}
                        <span className="rate" onClick={(e) => reviewHandler(e, store.id)}>
                            ⭐ {store.rateAvg} ({store.reviewCount})<b className='gt'>&gt;</b>
                        </span>
                    </div>
                    <div>
                        <img src={`${STORE_IMAGE_PATH}/${store.image}`} alt="이미지" className="store-image" /><b className='gt'>&gt;</b>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StoreList;