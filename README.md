# hhp-concert-ticketing

1. [Milestone](#Milestone)
2. [Sequence_diagram](#Sequence_diagram)
3. [Erd](#Erd)
4. [MockAPI](#MockAPI)

## Milestone
[3주차]
- 요구사항 분석하여 시퀀스 다이어그램을 작성합니다.
- 요구사항 분석하여 데이터베이스 구조 설계 및 ERD를 작성합니다.
- 요구사항 스펙에 맞추어 API 아키텍처 구조를 설계합니다.
- 요구사항 스펙에 맞추어 Mock API를 개발합니다.

[4주차]
- docker를 이용하여 local db server를 띄웁니다.
- Jwt 토큰을 이용한 토큰 발급 API를 개발합니다.
- Jwt 토큰을 이용한 토큰 발급 API의 단위 테스트를 작성합니다.
- Guard를 이용하여 Controller 호출 전 사용자 인증을 합니다.
- Guard 테스트를 위하여 e2e 테스트 코드를 작성합니다.
- 예약 가능한 날짜 조회API를 개발합니다.
- 예약 가능한 날짜 조회 API 단위 테스트를 작성합니다.
- 예약 가능한 좌석 조회 API를 개발합니다.
- 예약 가능한 좌석 조회 API 단위 테스트를 작성합니다.
- 잔액 충전 API를 개발합니다.
- 잔액 충전 API 단위 테스트를 작성합니다.
- 잔액 조회 API를 개발합니다.
- 잔액 조회 API 단위 테스트를 작성합니다.
- 좌석 예약 요청 API를 개발합니다.
- 좌석 예약 요청 API 단위 테스트를 작성합니다.
- 결제 API를 개발합니다.
- 결제 API 단위 테스트를 작성합니다.

[5주차]
- 유저 시나리오에 따른 통합 테스트를 작성합니다.
- 잔액 충전 API 동시성을 고려하여 리팩토링 및 통합 테스트를 작성합니다.
- 좌석 예약 요청 API 동시성 + 대기열을 고려하여 리팩토링 및 통합 테스트를 작성합니다.
- 결제 API 동시성 고려하여 리팩토링 및 통합 테스트를 작성합니다.
  

## Sequence_diagram

https://gitmind.com/app/docs/fbk1bbwh
![제목없음](https://github.com/nueob/hhp-concert-ticketing/assets/79954748/a7736c66-fbd3-4b07-bd80-3e49652a5e38)

## Erd
[https://dbdiagram.io/d/6682bb169939893daebad8ac](https://dbdiagram.io/d/6682bb169939893daebad8ac)
![Untitled (1)](https://github.com/nueob/hhp-concert-ticketing/assets/79954748/42c0f885-d6b8-4f5c-8def-eae6afd1e2bc)

- (확장성) 콘서트 날짜마다 다른 대관 장소일 가능성을 고려하여 콘서트와 대관 장소를 분리하여 구상하였습니다.
- (확장성) 콘서트 세부 option 추가 시 concert_option에 추가할 수 있습니다.
- (확장성) 대관 장소 이외에 테이블로 분리되어야 하는 항목이 생길 때, 해당 테이블을 만들고 concert_ticketing_info 외래키(논리적) 컬럼으로 넣을 수 있습니다.
- order_ticket 테이블을 step을 이용하여 결제 status를 관리할 수 있습니다.
- order_ticket_into 테이블을 이용하여 결제 당시 금액 등 정보를 정적으로 보관할 수 있습니다.
- user 테이블의 refresh_token을 저장하여 사용자 인증할 때 access_token 만료 시 데이터를 불러올 수 있습니다.
- user 포인트 사용내역을 저장하여 point의 무결성을 입증할 수 있습니다.
- user_queue를 이용하여 대기열을 관리할 수 있습니다.
  
## MockAPI & API 명세서

아래 링크를 통해 들어가시면 MockAPI & API 명세서를 볼 수 있습니다!<br>
https://documenter.getpostman.com/view/29319211/2sA3dxEXEQ




