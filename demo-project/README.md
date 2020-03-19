# demo-scheduler
demo-scheduler

### 필요한 스타일 파일
```
<link rel="stylesheet" type="text/css" href="./dist/css/style.css"/>
```

### 필요한 스크립트 파일
```
<script type="text/javascript" src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script type="text/javascript" src="https://code.jquery.com/ui/1.10.4/jquery-ui.min.js"></script>
<script type="text/javascript" src="./dist/js/jq.schedule.js"></script>
<script type="text/javascript" src="./dist/js/scheduler-demo.js"></script>
```

### 스케쥴러 사용하기
```
1. #schedule div생성하기
2. .schedule-modal-mask div 붙여넣기

3. 스케줄러 실행
<script type="text/javascript">
    var schedulerDemo = new schedulerDemo();
    schedulerDemo.start();
</script>
```

### 스케쥴러 커스텀하기
```html
1. 커스텀 할 파일 만들기 ex: schdeduler-edulub.ts

2. schedulerDemo를 상속시키기
ex: class SchedulerEdulub extends schedulerDemo {}

3. 필요한 옵션 생성
ex: private optionsForEdulub = {...};

4. 옵션을 집어넣고 실행할 함수 만들기
ex: 
start() {
    super.start(optionsForEdulub);
}

5. 추가로 원하는 이벤트 실행하기
ed: 
onEvent() {} 원하는 함수를 만들고
이 안에 이벤트들을 만든 다음에
super.start()함수 아래에 실행 시켜준다.

이제 이를 html에서 실행시키게 되면
<script type="text/javascript">
    var chedulerEdulub = new SchedulerEdulub();
    chedulerEdulub.start();
</script>
```

### ts compile
```
tsc --watch
```

### style compile
```
scss --watch src/sass/style.scss:dist/css/style.css
```

### 컴파일 장소
```
/dist
```
