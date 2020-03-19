declare var $: any;

class schedulerDemo {

    constructor() {
        this.modalClose();
    }

    private selectedSchedule = {} as any;
    // 기본 옵션
    option = {
        startTime: "07:00", // schedule start time(HH:ii)
        endTime: "22:00",   // schedule end time(HH:ii)
        widthTime: 60 * 30,  // cell timestamp example 10 minutes
        timeLineY: 100,       // height(px)
        draggable: true,  // 드래그 가능 유무
        widthTimeX: 25, // 스케쥴 너비
        // 변화가 생겼을 때
        // onChange: this.onChange,
        // 섹션 초기화했을 때
        // onInitRow: this.onInitRow,
        // 추가되어있는 스케줄 클릭했을 때
        onClick: (node: any, data: any) => {
            this.onClick(node, data);
            console.log('onclick');
        },
        // 섹션 추가됐을 때
        onAppendRow: (node: any, data: any) => {
            this.onAppendRow(node, data);
            console.log('onAppendRow');
        },
        // 스케줄 추가했을 때
        onAppendSchedule: (node: any, data: any) => {
            this.onAppendSchedule(node, data);
            console.log('onAppendSchedule');
        },
        // 비어있는 스케줄러 클릭했을 때
        onScheduleClick: (node: any, time: any, timeline: any) => {
            this.onScheduleClick(node, time, timeline);
            console.log('onScheduleClick');
        },
    };
    $sc: any;

    start(option: any) {
        const newOption = Object.assign({}, this.option, option);
        if (!newOption.element) {
            newOption.element = '#schedule';
        }
        const $sc = $(newOption.element).timeSchedule(newOption);

        // 섹션 클릭
        this.activeSection($sc);

        this.$sc = $sc;
    }

    // 변화가 생겼을 때
    onChange(node: any, data: any) {
    }

    // 섹션 초기화했을 때
    onInitRow(node: any, data: any) {
    }

    // 비어있는 스케줄러 클릭했을 때
    onScheduleClick(node: any, time: any, timeline: any) {
        const start = time;
        const end = this.$sc.timeSchedule('formatTime', this.$sc.timeSchedule('calcStringTime', time) + 3600);
        this.makeModal(start, end, timeline);
    }

    // 스케줄 추가했을 때
    onAppendSchedule(node: any, data: any) {
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
    }

    // 스케줄 추가했을 때
    onAppendRow(node: any, data: any) {
        this.activeSection(this.$sc);
    }

    // 추가되어있는 스케줄 클릭했을 때
    onClick(node: any, data: any) {
        const start = this.$sc.timeSchedule('formatTime', data.start);
        const end = this.$sc.timeSchedule('formatTime', data.end);
        this.modifyModal(data, start, end);
        const sectionTimeline = data.timeline;
        $('#sectionTimeline').val(sectionTimeline);
        this.selectedSchedule = data;
    }

    // 섹션 클릭
    activeSection($sc: any) {
        $('.sc_data_scroll .timeline').on('click', ($event: any) => {
            if ($event.target.className === 'timeline-title') {
                $('.schedule-title input').val($($event.target).text());
                this.sectionModal($($event.target).parent().index(), $sc);
            } else {
                $('.schedule-title input').val($($event.target).find('.timeline-title').text());
                this.sectionModal($($event.target).index(), $sc);
            }
        });
    }

    // 스케쥴 삭제
    deleteSchedule($sc: any) {
        const timelineData = new Object() as any;
        const timeScheduleClone = JSON.parse(JSON.stringify($sc.timeSchedule('timelineData')));
        $.each(timeScheduleClone, (i: number, k: any) => {
            timelineData[i] = k;
            $.each(k.schedule, (j: number, l: any) => {
                if ((this.selectedSchedule.text === l.text) && (this.selectedSchedule.start === l.start) && (this.selectedSchedule.end === l.end) && (this.selectedSchedule.timeline === l.timeline)) {
                    delete k.schedule[j];
                }
                l.start = $sc.timeSchedule('formatTime', l.start);
                l.end = $sc.timeSchedule('formatTime', l.end);
            })
        });
        $sc.timeSchedule('setRows', timelineData);
        this.modalClose();
    }

    // 섹션 수정
    modifySection($sc: any) {
        const timeScheduleClone = JSON.parse(JSON.stringify($sc.timeSchedule('timelineData')));
        const timelineDataArr = [] as any;
        const timelineDataObj = {} as any;
        const sectionNum = Number($('#sectionTimeline').val());
        $.each(timeScheduleClone, (i: number, k: any) => {
            if (sectionNum === i) {
                k.title = $('.schedule-title input').val();
            }
            timelineDataArr.push(k);
            $.each(k.schedule, (j: number, l: any) => {
                l.start = $sc.timeSchedule('formatTime', l.start);
                l.end = $sc.timeSchedule('formatTime', l.end);
            })
        });

        $.each(timelineDataArr, (i: number, k: any) => {
            timelineDataObj[i] = k;
        });

        $sc.timeSchedule('setRows', timelineDataObj);
        this.activeSection($sc);
        this.modalClose();
    }

    // 섹션 삭제
    deleteSection($sc: any) {
        const timeScheduleClone = JSON.parse(JSON.stringify($sc.timeSchedule('timelineData')));
        const timelineDataArr = [] as any;
        const timelineDataObj = {} as any;
        const sectionNum = Number($('#sectionTimeline').val());
        $.each(timeScheduleClone, (i: number, k: any) => {
            if (sectionNum !== i) {
                timelineDataArr.push(k);
                $.each(k.schedule, (j: number, l: any) => {
                    l.start = $sc.timeSchedule('formatTime', l.start);
                    l.end = $sc.timeSchedule('formatTime', l.end);
                })
            }
        });

        $.each(timelineDataArr, (i: number, k: any) => {
            timelineDataObj[i] = k;
        });

        $sc.timeSchedule('setRows', timelineDataObj);
        this.activeSection($sc);
        this.modalClose();
    }

    // 섹션 모달창
    sectionModal(index: number, $sc: any) {
        this.modal();
        $('.schedule-start').css('display', 'none');
        $('.schedule-end').css('display', 'none');
        $('.schedule-cancel').css('display', 'inline-block');
        $('.schedule-section-delete').css('display', 'inline-block');
        $('.schedule-section-modify').css('display', 'inline-block');
        $('#sectionTimeline').val(index);
    }

    // 스케쥴 수정
    modifySchedule($sc: any) {
        const timelineData = {} as any;
        const timeScheduleClone = JSON.parse(JSON.stringify($sc.timeSchedule('timelineData')));
        $.each(timeScheduleClone, (i: number, k: any) => {
            timelineData[i] = k;
            $.each(k.schedule, (j: number, l: any) => {
                if ((this.selectedSchedule.text === l.text) && (this.selectedSchedule.start === l.start) && (this.selectedSchedule.end === l.end) && (this.selectedSchedule.timeline === l.timeline)) {
                    l.start = $('.schedule-start input').val();
                    l.end = $('.schedule-end input').val();
                    l.text = $('.schedule-title input').val();
                } else {
                    l.start = $sc.timeSchedule('formatTime', l.start);
                    l.end = $sc.timeSchedule('formatTime', l.end);
                }
            })
        });
        $sc.timeSchedule('setRows', timelineData);
        this.modalClose();
    }

    // 스케줄 추가
    addSchedule($sc: any) {
        let $title = $('.schedule-title input');
        if (!$.trim($title.val()) || $title.val().length === 0) {
            return;
        }
        const newSchedule = {
            start: $('.schedule-start input').val(),
            end: $('.schedule-end input').val(),
            text: $title.val(),
            data: {
                class: ''
            }
        };
        $sc.timeSchedule('addSchedule', $('#sectionTimeline').val(), newSchedule);
    }

    // 색션추가
    addSection($sc: any) {
        const sectionName = $('.schedule-add-section').prev('input[type="text"]').val();
        if ($.trim(sectionName).length === 0) {
            alert('섹션의 이름을 입력해주세요.');
            return
        }
        const scheduleData = $sc.timeSchedule('timelineData');
        const sectionTimeline = scheduleData.length; // 이 timeline은 섹션 timeline(row's timeline);
        const newSectionObj = {} as any;
        newSectionObj.title = sectionName;
        $sc.timeSchedule('addRow', sectionTimeline, newSectionObj);
        $('.add-section-div input').val('');
        this.activeSection($sc);
    }

    // 수정하기 모달 창
    modifyModal(data: any, start: any, end: any) {
        this.modal();
        $('.schedule-cancel').css('display', 'inline-block');
        $('.schedule-delete').css('display', 'inline-block');
        $('.schedule-modify').css('display', 'inline-block');
        $('.schedule-title input').val(data.text);
        $('.schedule-start input').val(start);
        $('.schedule-end input').val(end);
        // $('#scheduleTimeline').val(data.timeline);
    }

    // 만들기 모달 창
    makeModal(start: any, end: any, timeline: any) {
        this.modal();
        $('.schedule-make').css('display', 'inline-block');
        $('.schedule-cancel').css('display', 'inline-block');
        $('.schedule-modify').css('display', 'none');
        $('.schedule-start input').val(start);
        $('.schedule-end input').val(end);
        $('#sectionTimeline').val(timeline);
    }

    modal() {
        $('.schedule-modal-mask').css('display', 'table');
        $('body').css('overflow', 'hidden');
        $('.schedule-modal-wrapper').css('opacity', 1);
        $('.schedule-title input').focus();
    }

    // 모달 창 닫기
    modalClose() {
        $('.schedule-title').val('');
        let $modalMask = $('.schedule-modal-mask');
        $modalMask.css('display', 'none');
        $('body').css('overflow', 'initial');
        $('.schedule-modal-wrapper').css('opacity', 0);
        $modalMask.find('input').val('');
        $modalMask.find('button').css('display', 'none');
    }
}

(window as any).schedulerApp = new schedulerDemo();
