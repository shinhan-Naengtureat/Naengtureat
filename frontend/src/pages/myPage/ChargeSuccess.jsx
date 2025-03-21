import { useNavigate } from 'react-router-dom';
import RouteConfig from 'routes/routeConfig';

function ChargeSuccess(props) {
    const navigate = useNavigate();

    const nextButtonHandler = () => {
        // 주문 완료 후 sessionStorage 정리
        navigate(RouteConfig.paths.home); // 메인으로 이동
        sessionStorage.removeItem("chargeAmount");
        sessionStorage.removeItem("isChargeProcessed");
    }

    return (
        <>
            <div>냉털잇페이 충전 완료</div>
            <button className="okay-button" onClick={nextButtonHandler}>
                    확인
            </button>
        </>
    );
}

export default ChargeSuccess;