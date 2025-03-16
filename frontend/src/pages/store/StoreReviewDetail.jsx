import axiosInstance from 'api/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'styles/store/StoreReviewDetail.css';

function StoreReviewDetail() {
    const { storeId } = useParams(); // URL에서 storeId 가져오기
    const [storeReviewList, setStoreReviewList] = useState([]);

    useEffect(() => {
        // 스토어 정보 & 리뷰 가져오기
        const fetchStoreReviewDetail = async () => {
            try {
                const storeReviewDTOList = await axiosInstance.get(`/store/${storeId}/review`);
                console.log("storeReviewDTOList : ", storeReviewDTOList.data);
                setStoreReviewList(storeReviewDTOList.data);
            } catch (error) {
                console.error("스토어 리뷰 정보를 가져오는 중 오류 발생: ", error);
            }
        };

        fetchStoreReviewDetail();
    }, [storeId]);

    if (!storeReviewList || storeReviewList.length === 0) return <div>리뷰가 없습니다.</div>;

    // 별 개수 생성 함수
    const renderStars = (rate) => {
        return "⭐".repeat(rate);
    };

    // 날짜 포맷 변경 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = String(date.getFullYear()).slice(2); // '25' 형식으로 변환
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 01 ~ 12
        const day = String(date.getDate()).padStart(2, '0'); // 01 ~ 31
        const hours = String(date.getHours()).padStart(2, '0'); // 00 ~ 23 (24시간제)
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 00 ~ 59

        return `${year}.${month}.${day}. ${hours}:${minutes}`;
    };

    return (
        <div className='review-container'>
            <div className='store-name'>{storeReviewList[0]?.storePlaceName}</div>

            {storeReviewList.map((review) => (
                <div key={review.id} className="review-card">
                    <div className="review-header">
                        <img src={`/assets/images/${review.memberImage || 'user-icon.png'}`} alt="프사" className='member-img'/>

                        <div className='review-info'>
                            <b className='member-name'>{review.memberName}</b><br />
                            <span className="review-rate">{renderStars(review.rate)}</span>
                            <span className="review-date">{formatDate(review.updateDate)}</span><br />
                        </div>
                    </div>

                    <div className="review-comment">{review.comment}</div>
                </div>
            ))}
        </div>
    );
}

export default StoreReviewDetail;