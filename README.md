# 🍽가까?마까?(GaggaMagga) 프로젝트 

![ex_screenshot](./images/main.png)
<br>

**프로젝트 기간** : 2022.11.30 ~ 2022.12.29
<br>
  
[🔗 가까 마까 서비스 둘러보기](http://gaggamagga.shop/)
<br>

<br>


## ****✨ 프로젝트 소개****


**기획 의도**
- 누구나 여행을 떠나서 음식점을 가거나, 점심 식사 메뉴를 정할 때 고민이 있었던 경험이 있을 것 입니다.
- 본 서비스는 '제주도' 라는 특정 지역에서 먹고자 하는 음식의 종류나 장소를 선택하면 사용자에게 **맛집을 추천**하고 있습니다.
- **추천 기능**은 머신러닝 유저기반 추천 기능을 활용하여 사용자와 가장 **유사한 경험**을 갖고 있는 사용자의 데이터들를 통해 음식점을 **추천**합니다.
- 방문한 맛집은 다른 사용자와 후기를 **공유**하고, 후기에는 별점을 넣어 **장소별 평가점수를 관리**할 수 있습니다.
- 각 후기에는 댓글과 대댓글 기능으로 **유저간 경험을 공유할 수 있는 플랫폼을 제공**합니다.
- 마음에 드는 장소는 북마크하여 저장하고, 성향이 잘 맞는 유저는 팔로우하여 해당 **유저의 경험을 공유**받을 수 있는 서비스를 구성하였습니다.

**Back-end Link**
<br>
[📥 Back-end Repository](https://github.com/woong-garden/GaGgaMaGga_BE)
<br>

**프로젝트 문서**
<br>
[📚 Notion 현황판 & 트러블 슈팅](https://liberating-engineer-32d.notion.site/11-30-12-29-482dc47b71d44e968cf32283bb422238)



<br>


## 🥘 ****서비스 시연 영상****

[![영상](http://img.youtube.com/vi/hTdLnu0ECPQ/0.jpg)](https://www.youtube.com/watch?v=hTdLnu0ECPQ) 

<br>

## 📃****기능 명세서****
  - 온보딩을 활용하여 사용자가 웹사이트를 접속했을 때 어떤 서비스를 제공하는지 간단하게 설명해줌
  - 사용자 환경(회원가입, 로그인, 회원정보 관리, 팔로우, 비활성화, 아이디/비밀번호 찾기 등등)
  - 맛집 후기(리뷰) 작성/수정/삭제, 조회수 카운트, 좋아요, 검색 기능  
  - 후기 댓글 작성/수정/삭제
  - 후기 댓글의 대댓글 작성/수정/삭제 기능
  - 유저간 댓글 알림 기능

<br>

## 🔨 ****개발 포지션 구성****
  
  <details>
    <summary >🛠 사재혁(팀장)</summary>
    <div markdown="1"></div>
  
  - 유저 관리, 프로필, 개인설정 및 추가 기능
  - user 테스트 코드
  - Docker, AWS 배포
  - CI/CD 구축
  - 코드 리팩토링/Swagger 적용

  </details>
  
   <details>
    <summary >🛠 장진</summary>
    <div markdown="2"></div>
  
  - 머신러닝 장소 추천 기능, 후기 조회수, 페이지네이션
  - place 테스트 코드
  - CI/CD 구축

  </details>
  
  <details>
  <summary >🛠 나웅주</summary>
  <div markdown="3"></div>
  
  - 리뷰 조회 페이지, Best 리뷰 페이지 
  - 전체적인 Font-End 수정
  
  </details>

  <details>
  <summary >🛠 이지영</summary>
  <div markdown="4"></div>
  
  - 북마크 기능, 좋아요 기능, 댓글/대댓글 기능 
  - review 테스트 코드


  </details>
  
  <details>
  <summary >🛠 이금빈</summary>
  <div markdown="5"></div>
  
  - 리뷰 생성 페이지, 팔로우 기능, 알림 기능, 검색 기능
  - notification 테스트 코드
  - Docker, AWS 배포

  </details>

<br>

## ****💻 기술 스택****  

### Frontend : <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=black"> <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"> <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=Bootstrap&logoColor=white">
### Server : <img src="https://img.shields.io/badge/AMAZON EC2-FFE900?style=for-the-badge&logo=amazon&logoColor=black"> <img src="https://img.shields.io/badge/DOCKER 20.10.12-3D97FF?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/DOCKER COMPOSE 2.11.2-3D97FF?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/GUNICORN-2BB530?style=for-the-badge&logo=gunicorn&logoColor=white"> <img src="https://img.shields.io/badge/NGINX 1.23.2 -2F9624?style=for-the-badge&logo=nginx&logoColor=white"> <img src="https://img.shields.io/badge/daphne-303030?style=for-the-badge&logo=daphne&logoColor=white"> <img src="https://img.shields.io/badge/redis 7.0.7-FF1F1F?style=for-the-badge&logo=redis&logoColor=white">
### Management : <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/github action-3399FF?style=for-the-badge&logo=github&logoColor=white">
### Database : <img src="https://img.shields.io/badge/postgresql 14.5-0000FF?style=for-the-badge&logo=postgresql&logoColor=white">

<br>

## 📚 ****Used API, Dataset****
  - **소셜로그인** : KAKAO Oauth2 API
  - **계정 찾기** : NAVER Cloud SMS API
  - **지도 App** : NAVER Web Dynamic Map API
  - **검색 App** : ALGOLIA API
  - **IP 정보 확인** : Whois API
  - **맛집 Data** : NAVER Map v5.0 crawling Data
  

<br>

## 🧱 ****Project Architecture****

![ex_screenshot](./images/architecture.png)

<br>

## 🕸 ****[Wireframe](https://www.figma.com/file/dlmax1N0WmxIWkeoxWMWCs/%EC%B5%9C%EC%A2%85-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=0%3A1&t=0TMnEGrfJz1zCmk7-0)****
![ex_screenshot](./images/wireframe.png)

<br>

## 🛢 ****[Database ERD](https://www.erdcloud.com/d/RvXb4PCLq3t3CPb3e)****

![ex_screenshot](./images/erd.png)


<br>

## 🎯 ****Notion API**** | ****[Swagger API Docs](https://www.gaggamagga.tk)****


<details>
<summary style="font-size: 18px;">USER API</summary>
<div markdown="1">

![ex_screenshot](./images/user_api.png)

</div>
</details>


<details>
<summary style="font-size: 18px;">PLACE API</summary>
<div markdown="1">

![ex_screenshot](./images/place_api.png)

</div>
</details>

<details>
<summary style="font-size: 18px;">REVIEW API</summary> 
<div markdown="1">

![ex_screenshot](./images/review_api.png)

</div>
</details>


<details>
<summary style="font-size: 18px;">NOTIFICATION API</summary>
<div markdown="1">

![ex_screenshot](./images/notification_api.png)

</div>
</details>

<br>

<br>



