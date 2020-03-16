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
<script type="text/javascript">
    var schedulerDemo = new schedulerDemo();
    schedulerDemo.start();
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
