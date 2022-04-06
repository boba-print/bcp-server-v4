# Boba Cloud Print Server

## 설계 철학

> 빨리..빨리...

1. 필요한 기능을 빨리 작성할 수 있어야 함
2. 따라서 코드의 양이 많으면 안됨
3. 최대한 프레임워크들에서 자동 생성되는 코드를 그대로 사용 함
4. DB 스키마의 변화에 손쉽게 대처할 수 있어야 함
5. 비지니스 모델 변화에도 최대한 유연하게 대처 가능하게 함
6. 해당 조건을 따르며 도메인 모델 위주로 개발

## 설계

### 2 + 1 Layer Architecture

* Layer1: Controller
* Layer2: Service

* Model (Domain Model)-  모델의 비즈니스 로직을 담당함
* Prisma: 빨리 만들고 스키마 변화의 쉬운 대처를 위해 Persistence layer를 Prisma Client 를 사용하는 것으로 대체함 

상향식 접근으로 Prisma 부터 설명...

#### Prisma

Prisma schema 의 `@map` 기능을 이용해서 도메인 모델에서 사용 될 속성들을 정의. 
따라서 DAO 에서 domain model 을 생성하기 위해 따로 Mapper 를 생성하지 않음. 
이것은 만약 DB schema 가 바뀌더라도 Typescript 의 type checking 을 통해 프로그램 전역에 영향받는 부분을 한번에 체킹 할 수 있도록 함. 
Prisma library 의존성이 service layer 로 전염됨. 
하지만 별로 상관 안함. 스타트업 특성상 ORM 라이브러리를 바뀌야 할 상황보다 비즈니스 모델을 바꿀 상황이 훨씬 많음. 

... 작성중

### Model (Domain Model)

Domain model 에서는 모델 단위의 비즈니스 로직을 처리합니다.

저희 Domain Model 에서는 Dto 를 생성하는 역할도 맡고있습니다.
DDD 에서의 Domain Model 은 순수한 상태이고 
다른 모듈에 대해 모르는 상태로 독립되어야 한다고 하지만 저희는 그렇지 않습니다.
하지만 Dto 를 생성하는 역할을 갖는다고 한들 다른 모듈에 Domain Model 을 이식하더라도 코드를 삭제하기만 하면 되기 때문에 그닥 문제가 되지 않습니다.
오히려 작업하기 편리합니다. 




