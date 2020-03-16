"use strict";
var schedulerDemo = /** @class */ (function () {
    function schedulerDemo() {
        this.selectedSchedule = {};
        this.modalClose();
    }
    schedulerDemo.prototype.start = function () {
        var _this = this;
        var isDraggable = true;
        var isResizable = true;
        var $sc = $("#schedule").timeSchedule({
            startTime: "07:00",
            endTime: "24:00",
            widthTime: 60 * 30,
            timeLineY: 100,
            verticalScrollbar: 25,
            // timeLineBorder: 2,   // border(top and bottom)
            // bundleMoveWidth: 6,  // width to move all schedules to the right of the clicked time line cell
            draggable: isDraggable,
            resizable: isResizable,
            // 테스트 초기화 정보
            rows: {
                '0': {
                    title: 'ex0',
                    schedule: [
                        {
                            start: '09:00',
                            end: '12:00',
                            text: 'ex0-1',
                            data: {}
                        },
                        {
                            start: '12:00',
                            end: '15:00',
                            text: 'ex0-2',
                            data: {}
                        }
                    ]
                },
                '1': {
                    title: 'ex1',
                    schedule: [
                        {
                            start: '15:00',
                            end: '18:00',
                            text: 'ex1-1',
                            data: {}
                        }
                    ]
                }
            },
            // 변화가 생겼을 때
            onChange: function (node, data) {
            },
            // 섹션 초기화했을 때
            onInitRow: function (node, data) {
            },
            // 추가되어있는 스케줄 클릭했을 때
            onClick: function (node, data) {
                var start = $(_this).timeSchedule('formatTime', data.start);
                var end = $(_this).timeSchedule('formatTime', data.end);
                _this.modifyModal(data, start, end);
                var sectionTimeline = data.timeline;
                $('#sectionTimeline').val(sectionTimeline);
                _this.selectedSchedule = data;
            },
            // 섹션 추가됐을 때
            onAppendRow: function (node, data) {
                _this.activeSection($sc);
            },
            // 스케줄 추가했을 때
            onAppendSchedule: function (node, data) {
                if (data.data.class) {
                    node.addClass(data.data.class);
                }
                if (data.data.image) {
                    var $img = $('<div class="photo"><img></div>');
                    $img.find('img').attr('src', data.data.image);
                    node.prepend($img);
                    node.addClass('sc_bar_photo');
                }
                _this.modalClose();
            },
            // 비어있는 스케줄러 클릭했을 때
            onScheduleClick: function (node, time, timeline) {
                var start = time;
                var end = $(_this).timeSchedule('formatTime', $(_this).timeSchedule('calcStringTime', time) + 3600);
                _this.makeModal(start, end, timeline);
            },
        });
        $('#event_timelineData').on('click', function () {
            console.log($sc.timeSchedule('timelineData'));
        });
        $('#event_scheduleData').on('click', function () {
        });
        // 수정하기 클릭
        $('.modify').on('click', function () {
            _this.modifySchedule($sc);
        });
        // 취소 클릭
        $('.cancel').on('click', function () {
            _this.modalClose();
        });
        // 만들기 클릭
        $('.make').on('click', function () {
            _this.addSchedule($sc);
        });
        // 스케쥴 삭제 클릭
        $('.delete').on('click', function () {
            _this.deleteSchedule($sc);
        });
        // 섹션 추가하기
        $('.add-section').on('click', function () {
            _this.addSection($sc);
        });
        // 섹션 삭제하기
        $('.section-delete').on('click', function () {
            _this.deleteSection($sc);
        });
        // 섹션 수정하기
        $('.section-modify').on('click', function () {
            _this.modifySection($sc);
        });
        $('#clear-logs').on('click', function () {
            $('#logs .table').empty();
        });
        // ajax 데이터 랜더링
        $('.ajax-data').on('click', function ($event) {
            $.ajax({ url: './demo/' + $($event.target).attr('data-target') })
                .done(function (data) {
                $sc.timeSchedule('setRows', data);
            });
        });
        // 섹션 클릭
        this.activeSection($sc);
        // esc 눌렀을 때
        $('.modal-mask, .modal-wrapper, .modal-container, .modal-pop').on('keyup', function (e) {
            if (e.keyCode === 27) {
                _this.modalClose();
            }
        });
    };
    // 섹션 클릭
    schedulerDemo.prototype.activeSection = function ($sc) {
        var _this = this;
        $('.sc_data_scroll .timeline').on('click', function ($event) {
            if ($event.target.className === 'timeline-title') {
                $('.title').val($($event.target).text());
                _this.sectionModal($($event.target).parent().index(), $sc);
            }
            else {
                $('.title').val($($event.target).find('.timeline-title').text());
                _this.sectionModal($($event.target).index(), $sc);
            }
        });
    };
    // 스케쥴 삭제
    schedulerDemo.prototype.deleteSchedule = function ($sc) {
        var _this = this;
        var timelineData = new Object();
        var timeScheduleClone = JSON.parse(JSON.stringify($sc.timeSchedule('timelineData')));
        $.each(timeScheduleClone, function (i, k) {
            timelineData[i] = k;
            $.each(k.schedule, function (j, l) {
                if ((_this.selectedSchedule.text === l.text) && (_this.selectedSchedule.start === l.start) && (_this.selectedSchedule.end === l.end) && (_this.selectedSchedule.timeline === l.timeline)) {
                    delete k.schedule[j];
                }
                l.start = $sc.timeSchedule('formatTime', l.start);
                l.end = $sc.timeSchedule('formatTime', l.end);
            });
        });
        $sc.timeSchedule('setRows', timelineData);
        this.modalClose();
    };
    // 섹션 수정
    schedulerDemo.prototype.modifySection = function ($sc) {
        var timeScheduleClone = JSON.parse(JSON.stringify($sc.timeSchedule('timelineData')));
        var timelineDataArr = new Array();
        var timelineDataObj = new Object();
        var sectionNum = Number($('#sectionTimeline').val());
        $.each(timeScheduleClone, function (i, k) {
            if (sectionNum === i) {
                k.title = $('.title').val();
            }
            timelineDataArr.push(k);
            $.each(k.schedule, function (j, l) {
                l.start = $sc.timeSchedule('formatTime', l.start);
                l.end = $sc.timeSchedule('formatTime', l.end);
            });
        });
        $.each(timelineDataArr, function (i, k) {
            timelineDataObj[i] = k;
        });
        $sc.timeSchedule('setRows', timelineDataObj);
        this.activeSection($sc);
        this.modalClose();
    };
    // 섹션 삭제
    schedulerDemo.prototype.deleteSection = function ($sc) {
        var timeScheduleClone = JSON.parse(JSON.stringify($sc.timeSchedule('timelineData')));
        var timelineDataArr = new Array();
        var timelineDataObj = new Object();
        var sectionNum = Number($('#sectionTimeline').val());
        $.each(timeScheduleClone, function (i, k) {
            if (sectionNum !== i) {
                timelineDataArr.push(k);
                $.each(k.schedule, function (j, l) {
                    l.start = $sc.timeSchedule('formatTime', l.start);
                    l.end = $sc.timeSchedule('formatTime', l.end);
                });
            }
        });
        $.each(timelineDataArr, function (i, k) {
            timelineDataObj[i] = k;
        });
        $sc.timeSchedule('setRows', timelineDataObj);
        this.activeSection($sc);
        this.modalClose();
    };
    // 섹션 모달창
    schedulerDemo.prototype.sectionModal = function (index, $sc) {
        this.modal();
        $('.start').css('display', 'none');
        $('.end').css('display', 'none');
        $('.cancel').css('display', 'inline-block');
        $('.section-delete').css('display', 'inline-block');
        $('.section-modify').css('display', 'inline-block');
        $('#sectionTimeline').val(index);
    };
    // 스케쥴 수정
    schedulerDemo.prototype.modifySchedule = function ($sc) {
        var _this = this;
        var timelineData = new Object();
        var timeScheduleClone = JSON.parse(JSON.stringify($sc.timeSchedule('timelineData')));
        $.each(timeScheduleClone, function (i, k) {
            timelineData[i] = k;
            $.each(k.schedule, function (j, l) {
                if ((_this.selectedSchedule.text === l.text) && (_this.selectedSchedule.start === l.start) && (_this.selectedSchedule.end === l.end) && (_this.selectedSchedule.timeline === l.timeline)) {
                    l.start = $('.start').val();
                    l.end = $('.end').val();
                    l.text = $('.title').val();
                }
                else {
                    l.start = $sc.timeSchedule('formatTime', l.start);
                    l.end = $sc.timeSchedule('formatTime', l.end);
                }
            });
        });
        $sc.timeSchedule('setRows', timelineData);
        this.modalClose();
    };
    // 스케줄 추가
    schedulerDemo.prototype.addSchedule = function ($sc) {
        if (!$.trim($('.title').val()) || $('.title').val().length === 0) {
            return;
        }
        var newSchedule = {
            start: $('.start').val(),
            end: $('.end').val(),
            text: $('.title').val(),
            data: {
                class: ''
            }
        };
        $sc.timeSchedule('addSchedule', $('#sectionTimeline').val(), newSchedule);
    };
    // 색션추가
    schedulerDemo.prototype.addSection = function ($sc) {
        var sectionName = $('.add-section').prev('input[type="text"]').val();
        var scheduleData = $sc.timeSchedule('timelineData');
        var sectionTimeline = scheduleData.length; // 이 timeline은 섹션 timeline(row's timeline);
        var newSectionObj = new Object();
        newSectionObj.title = sectionName;
        $sc.timeSchedule('addRow', sectionTimeline, newSectionObj);
        this.activeSection($sc);
    };
    // 수정하기 모달 창
    schedulerDemo.prototype.modifyModal = function (data, start, end) {
        this.modal();
        $('.cancel').css('display', 'inline-block');
        $('.delete').css('display', 'inline-block');
        $('.modify').css('display', 'inline-block');
        $('.title').val(data.text);
        $('.start').val(start);
        $('.end').val(end);
        // $('#scheduleTimeline').val(data.timeline);
    };
    // 만들기 모달 창
    schedulerDemo.prototype.makeModal = function (start, end, timeline) {
        this.modal();
        $('.make').css('display', 'inline-block');
        $('.cancel').css('display', 'inline-block');
        $('.modify').css('display', 'none');
        $('.start').val(start);
        $('.end').val(end);
        $('#sectionTimeline').val(timeline);
    };
    schedulerDemo.prototype.modal = function () {
        $('.modal-mask').css('display', 'table');
        $('body').css('overflow', 'hidden');
        $('.modal-wrapper').css('opacity', 1);
    };
    // 모달 창 닫기
    schedulerDemo.prototype.modalClose = function () {
        $('.title').val('');
        var $modalMask = $('.modal-mask');
        $modalMask.css('display', 'none');
        $('body').css('overflow', 'initial');
        $('.modal-wrapper').css('opacity', 0);
        $modalMask.find('input').val('');
        $modalMask.find('button').css('display', 'none');
    };
    return schedulerDemo;
}());
window.schedulerApp = new schedulerDemo();
