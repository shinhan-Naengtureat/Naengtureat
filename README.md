
# 🧊 Naengtureat
**하마터면 버릴뻔했다! 이렇게 근사한 한끼!**

- 냉털잇은 생성형 AI를 통해 1주일간의 맞춤 식단과 레시피를 추천하고,
  재료 주문 및 관리를 지원하는 통합 서비스입니다.
## Authors
<table>
  <tr>
         <td align="center" width="16%">
            <a href="https://github.com/jamm0316"><img width="75%" src="readme/jm.jpg"/></a>
            <br />
            <a href="https://github.com/jamm0316">송재명</a>
        </td>
         <td align="center" width="16%">
            <a href="https://github.com/2th-millie"><img width="75%" src="readme/th.jpg"/></a>
            <br />
            <a href="https://github.com/2th-millie">이태한</a>
        </td>
         <td align="center" width="16%">
            <a href="https://github.com/GJKim-James"><img width="75%" src="readme/gj.jpg"/></a>
            <br />
            <a href="https://github.com/GJKim-James">김광진</a>
        </td>
         <td align="center" width="16%">
            <a href="https://github.com/eunziCode"><img width="75%" src="readme/ej.jpg"/></a>
            <br />
            <a href="https://github.com/eunziCode">박은지</a>
        </td>
         <td align="center" width="16%">
            <a href="https://github.com/Woong0405"><img width="75%" src="readme/su.jpg"/></a>
            <br />
            <a href="https://github.com/Woong0405">윤성웅</a>
        </td>
         <td align="center" width="16%">
            <a href="https://github.com/hyejinn916"><img width="75%" src="readme/hj.jpg"/></a>
            <br />
            <a href="https://github.com/hyejinn916">류혜진</a>
        </td>
    </tr>
</table>

## Tech Stack

**Client:** React ver.18, BootStrap

**Server:** Java ver.17, SpringBoot, JPA, queryDSL

**Database:** MariaDB

## Archetecture

![archtecture](https://github.com/user-attachments/assets/078cf467-689d-4ff3-88c6-faa1caf5f24f)

## Development Environment


`IDE` Intellij, STS4

`JDK` >= 17

`OS` mac, window

## 유저저니맵
<img width="500" alt="image" src="https://github.com/user-attachments/assets/42fb63a4-22a9-4ccd-94ee-f855ee5d50d9" />


## 스크린샷

### 냉페이 충전
- 사용자가 충전을 원하는 금액을 입력한 후 충전하기버튼을 결제를 진행한 후 해당 금액만큼 페이머니를 충전합니다.
<img width="500" src="![01 페이충전](https://github.com/user-attachments/assets/2b1faed1-0f02-49ce-b581-9a9ef71a4a07)" />

### 식단 생성
- 1주에 쓸 예산과 선호, 비선호 재료, 식단 희망 날짜 등을 입력하면 AI가 맞춤형 식단을 생성해줍니다.
- 식단은 낱개로 새로고침이 가능하며, 원하는 날짜로 이동 가능합니다.
![02 식단저장_fast](https://github.com/user-attachments/assets/db97de0d-aade-4348-81d5-aaf713f12c6f)

### 부족한 재료 비교 및 장바구니에 담기
- 이번 주 생성된 식단에 필요한 재료 갯수와 내가 가진 재료 갯수를 비교하여 부족한 재료를 알려줍니다.
- 부족한 재료는 우리집으로 등록한 위치 기준 2km반경 내의 마트에서 가격을 기준으로 비교 검색해줍니다.
- 선택한 마트의 재료를 장바구니에 담습니다.
![03 부족한 재료담기_fast](https://github.com/user-attachments/assets/7e0e7c36-0cbb-40c7-a58e-1ff3869c6259)

### 재료 구매
- 장바구니에 담겨진 재료를 결제합니다.
![04  부족한재료 주문_fast](https://github.com/user-attachments/assets/58c3898a-4d7c-425c-8f10-20a38542dcc8)

### 재료갯수 확인 및 원하는 레시피 추가
- 구매한 재료는 장바구니에 담기게 됩니다.
- 레시피 탭에서 원하는 레시피 검색이 가능하며, 레시피를 내 식단일정에 직접 추가할 수 있습니다.
![05 재료갯수 확인 및 원하는 레시피 추가_fast](https://github.com/user-attachments/assets/0db85560-42d3-47de-bc5b-c1a01b68fda0)

### 식단이행여부 확인 및 재료차감 확인
- 식단일정에서 식단을 이행할 시 5포인트가 적립됩니다.
- 이행된 식단은 초록색으로 변하여 이행한 상태로 바뀝니다.
![06 식단이행여부 확인 및 재료차감 확인_fast](https://github.com/user-attachments/assets/63ab4f28-f7b4-474f-aa0d-a0fba2225291)

### 식단 날짜변경 및 이번달 총 절약금액 확인
- 식단날짜가 마음에 들지 않으면 날짜변경이 가능합니다.
- 월간 식단조회에서 얼마나 식단을 이행했는지, 이번달에 대한민국 1끼 외식가격 기준 얼마를 아꼈는지 확인할 수 있습니다.
![07 식단 날짜변경 및 이번달 총 절약금액 확인_fast](https://github.com/user-attachments/assets/223d1b88-9d20-4823-8d8c-22d827592a54)



## 디렉토리 구조

> backend
> ㅁㄴㅇㄹ
> ㄴㅁㅇㄹ


> frontend
> ㅁㄴㅇㄹ
> ㄴㅁㅇㄹ

<!-- ## API Reference

### Auth

#### login page

```http
  GET /auth/login.do
```

#### login

```http
  POST /auth/login.do
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `member_id` | `string` | **Required**. Id of member |
| `password`  | `string` | **Required**. password of member |


### Room

#### room page

```http
  GET /room/rooms.do
```

### Chat

#### chat page

```http
  GET /chat/chat.do?chatId
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `chatId` | `int` | **Required**. chatId for enter chat |
-->

## Run Locally

project Clone

```bash
  git clone https://github.com/Naengtureat
```

npm start
```
npm i
npm start
```

