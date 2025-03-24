import { GIF_IMAGE_PATH } from 'config/pathConfig';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RouteConfig from 'routes/routeConfig';
import 'styles/mypage/ChargeSuccess.css';

function ChargeSuccess(props) {
    const navigate = useNavigate();

    const nextButtonHandler = () => {
        // 주문 완료 후 sessionStorage 정리
        navigate(RouteConfig.paths.home); // 메인으로 이동
        sessionStorage.removeItem("chargeAmount");
        sessionStorage.removeItem("isChargeProcessed");
    }

    return (
        <div className='charge-complete-wrapper'>
            <div className='charge-complete'>
                <img src={`${GIF_IMAGE_PATH}/ChargeComplete.gif`} alt="ChargeComplete" />
                <div className='charge-text-icon'>
                    <FaCheckCircle className='charge-check-icon' />
                    <span className='charge-complete-text'>충전 완료</span>
                </div>
            </div>
            <button className="charge-okay-button" onClick={nextButtonHandler}>
                확인
            </button>
        </div>
    );
}

export default ChargeSuccess;