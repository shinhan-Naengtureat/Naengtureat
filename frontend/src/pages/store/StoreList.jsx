import axiosInstance from 'api/axios';
import { API_PATH } from 'config/pathConfig';
import { useEffect, useState } from 'react';
import 'styles/store/StoreList.css';

function StoreList() {
    const [store, setStore] = useState(null);

    useEffect(() => {
        axiosInstance.get(`${API_PATH}/store/12325150/detail`)
            .then(response => {
                // 백엔드에서 storeDTO 형태로 반환
                const storeDTO = response.data;
                console.log(storeDTO);

                setStore(storeDTO);
            }).catch(error => {
                console.error('스토어 상세 조회 중 오류 발생: ', error);
            })
    }, []);

    if (!store) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* 검색 결과 목록으로 표시(DB에서 가져오기!!!) */}
            <div className="store-detail">
                <div className="store-info">
                    <p><strong>{store.placeName}</strong></p>
                    <p>{store.roadAddressName}</p>
                    <p>{store.phone}</p>
                    <p>⭐{store.rateAvg} ({store.reviewCount}) &gt;</p>
                </div>
                <div>
                    <img src={store.image} alt="이미지" className="store-image" />&gt;
                </div>
            </div>
        </div>
    );
}

export default StoreList;