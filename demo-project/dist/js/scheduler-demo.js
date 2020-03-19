"use strict";
var schedulerDemo = /** @class */ (function () {
    function schedulerDemo() {
        var _this = this;
        this.selectedSchedule = {};
        // 기본 옵션
        this.option = {
            startTime: "07:00",
            endTime: "22:00",
            widthTime: 60 * 30,
            timeLineY: 100,
            draggable: true,
            widthTimeX: 25,
            // 변화가 생겼을 때
            // onChange: this.onChange,
            // 섹션 초기화했을 때
            // onInitRow: this.onInitRow,
            // 추가되어있는 스케줄 클릭했을 때
            onClick: function (node, data) {
                _this.onClick(node, data);
                console.log('onclick');
            },
            // 섹션 추가됐을 때
            onAppendRow: function (node, data) {
                _this.onAppendRow(node, data);
                console.log('onAppendRow');
            },
            // 스케줄 추가했을 때
            onAppendSchedule: function (node, data) {
                _this.onAppendSchedule(node, data);
                console.log('onAppendSchedule');
            },
            // 비어있는 스케줄러 클릭했을 때
            onScheduleClick: function (node, time, timeline) {
                _this.onScheduleClick(node, time, timeline);
                console.log('onScheduleClick');
            },
        };
        this.modalClose();
    }
    schedulerDemo.prototype.start = function (option) {
        var newOption = Object.assign({}, this.option, option);
        if (!newOption.element) {
            newOption.element = '#schedule';
        }
        var $sc = $(newOption.element).timeSchedule(newOption);
        // 섹션 클릭
        this.activeSection($sc);
        this.$sc = $sc;
    };
    // 변화가 생겼을 때
    schedulerDemo.prototype.onChange = function (node, data) {
    };
    // 섹션 초기화했을 때
    schedulerDemo.prototype.onInitRow = function (node, data) {
    };
    // 비어있는 스케줄러 클릭했을 때
    schedulerDemo.prototype.onScheduleClick = function (node, time, timeline) {
        var start = time;
        var end = this.$sc.timeSchedule('formatTime', this.$sc.timeSchedule('calcStringTime', time) + 3600);
        this.makeModal(start, end, timeline);
    };
    // 스케줄 추가했을 때
    schedulerDemo.prototype.onAppendSchedule = function (node, data) {
        if (data.data.class) {
            node.addClass(data.data.class);
        }
        if (data.data.image) {
            var $img = $('<div class="photo"><img></div>');
            $img.find('img').attr('src', data.data.image);
            node.prepend($img);
            node.addClass('sc_bar_photo');
        }
        this.modalClose();
    };
    // 스케줄 추가했을 때
    schedulerDemo.prototype.onAppendRow = function (node, data) {
        this.activeSection(this.$sc);
    };
    // 추가되어있는 스케줄 클릭했을 때
    schedulerDemo.prototype.onClick = function (node, data) {
        var start = this.$sc.timeSchedule('formatTime', data.start);
        var end = this.$sc.timeSchedule('formatTime', data.end);
        this.modifyModal(data, start, end);
        var sectionTimeline = data.timeline;
        $('#sectionTimeline').val(sectionTimeline);
        this.selectedSchedule = data;
    };
    // 섹션 클릭
    schedulerDemo.prototype.activeSection = function ($sc) {
        var _this = this;
        $('.sc_data_scroll .timeline').on('click', function ($event) {
            if ($event.target.className === 'timeline-title') {
                $('.schedule-title input').val($($event.target).text());
                _this.sectionModal($($event.target).parent().index(), $sc);
            }
            else {
                $('.schedule-title input').val($($event.target).find('.timeline-title').text());
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
        var timelineDataArr = [];
        var timelineDataObj = {};
        var sectionNum = Number($('#sectionTimeline').val());
        $.each(timeScheduleClone, function (i, k) {
            if (sectionNum === i) {
                k.title = $('.schedule-title input').val();
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
        var timelineDataArr = [];
        var timelineDataObj = {};
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
        $('.schedule-start').css('display', 'none');
        $('.schedule-end').css('display', 'none');
        $('.schedule-cancel').css('display', 'inline-block');
        $('.schedule-section-delete').css('display', 'inline-block');
        $('.schedule-section-modify').css('display', 'inline-block');
        $('#sectionTimeline').val(index);
    };
    // 스케쥴 수정
    schedulerDemo.prototype.modifySchedule = function ($sc) {
        var _this = this;
        var timelineData = {};
        var timeScheduleClone = JSON.parse(JSON.stringify($sc.timeSchedule('timelineData')));
        $.each(timeScheduleClone, function (i, k) {
            timelineData[i] = k;
            $.each(k.schedule, function (j, l) {
                if ((_this.selectedSchedule.text === l.text) && (_this.selectedSchedule.start === l.start) && (_this.selectedSchedule.end === l.end) && (_this.selectedSchedule.timeline === l.timeline)) {
                    l.start = $('.schedule-start input').val();
                    l.end = $('.schedule-end input').val();
                    l.text = $('.schedule-title input').val();
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
        var $title = $('.schedule-title input');
        if (!$.trim($title.val()) || $title.val().length === 0) {
            return;
        }
        var newSchedule = {
            start: $('.schedule-start input').val(),
            end: $('.schedule-end input').val(),
            text: $title.val(),
            data: {
                class: ''
            }
        };
        $sc.timeSchedule('addSchedule', $('#sectionTimeline').val(), newSchedule);
    };
    // 색션추가
    schedulerDemo.prototype.addSection = function ($sc) {
        var sectionName = $('.schedule-add-section').prev('input[type="text"]').val();
        if ($.trim(sectionName).length === 0) {
            alert('섹션의 이름을 입력해주세요.');
            return;
        }
        var scheduleData = $sc.timeSchedule('timelineData');
        var sectionTimeline = scheduleData.length; // 이 timeline은 섹션 timeline(row's timeline);
        var newSectionObj = {};
        newSectionObj.title = sectionName;
        $sc.timeSchedule('addRow', sectionTimeline, newSectionObj);
        $('.add-section-div input').val('');
        this.activeSection($sc);
    };
    // 수정하기 모달 창
    schedulerDemo.prototype.modifyModal = function (data, start, end) {
        this.modal();
        $('.schedule-cancel').css('display', 'inline-block');
        $('.schedule-delete').css('display', 'inline-block');
        $('.schedule-modify').css('display', 'inline-block');
        $('.schedule-title input').val(data.text);
        $('.schedule-start input').val(start);
        $('.schedule-end input').val(end);
        // $('#scheduleTimeline').val(data.timeline);
    };
    // 만들기 모달 창
    schedulerDemo.prototype.makeModal = function (start, end, timeline) {
        this.modal();
        $('.schedule-make').css('display', 'inline-block');
        $('.schedule-cancel').css('display', 'inline-block');
        $('.schedule-modify').css('display', 'none');
        $('.schedule-start input').val(start);
        $('.schedule-end input').val(end);
        $('#sectionTimeline').val(timeline);
    };
    schedulerDemo.prototype.modal = function () {
        $('.schedule-modal-mask').css('display', 'table');
        $('body').css('overflow', 'hidden');
        $('.schedule-modal-wrapper').css('opacity', 1);
        $('.schedule-title input').focus();
    };
    // 모달 창 닫기
    schedulerDemo.prototype.modalClose = function () {
        $('.schedule-title').val('');
        var $modalMask = $('.schedule-modal-mask');
        $modalMask.css('display', 'none');
        $('body').css('overflow', 'initial');
        $('.schedule-modal-wrapper').css('opacity', 0);
        $modalMask.find('input').val('');
        $modalMask.find('button').css('display', 'none');
    };
    return schedulerDemo;
}());
window.schedulerApp = new schedulerDemo();
