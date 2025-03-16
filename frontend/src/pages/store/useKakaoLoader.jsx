import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";

function useKakaoLoader() {
    // const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

    // useEffect(() => {
    //     if (window.kakao && window.kakao.maps) {
    //         setIsKakaoLoaded(true);
    //         return;
    //     }

    //     const script = document.createElement("script");
    //     script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=%REACT_APP_KAKAO_MAP_JS_KEY%&libraries=services,clusterer,drawing&autoload=false`;
    //     script.async = true;
    //     script.onload = () => {
    //         window.kakao.maps.load(() => {
    //             setIsKakaoLoaded(true);
    //         });
    //     };

    //     document.head.appendChild(script);
    // }, []);

    // return isKakaoLoaded; // 로드 여부 반환

    useKakaoLoaderOrigin({
        /** 
         * ※주의※ appkey의 경우 본인의 appkey를 사용하셔야 합니다.
         * 해당 키는 docs를 위해 발급된 키 이므로, 임의로 사용하셔서는 안됩니다.
         * 
         * @참고 https://apis.map.kakao.com/web/guide/
         */
        appkey: process.env.REACT_APP_KAKAO_MAP_JS_KEY,
        libraries: ["clusterer", "drawing", "services"],
    });
}

export default useKakaoLoader;