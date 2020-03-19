class SchedulerEdulub extends schedulerDemo {

    private optionForEdulub = {

    };

    start() {
        super.start(this.optionForEdulub);
        this.onEvent();
    }

    onEvent() {
        // 수정하기 클릭
        $('.schedule-modify').on('click', () => {
            this.modifySchedule(this.$sc);
        });

        // 취소 클릭
        $('.schedule-cancel').on('click', () => {
            this.modalClose();
        });

        // 만들기 클릭
        $('.schedule-make').on('click', () => {
            this.addSchedule(this.$sc)
        });

        // 스케쥴 삭제 클릭
        $('.schedule-delete').on('click', () => {
            this.deleteSchedule(this.$sc);
        });

        // 섹션 추가하기
        $('.schedule-add-section').on('click', () => {
            this.addSection(this.$sc);
        });

        // 섹션 삭제하기
        $('.schedule-section-delete').on('click', () => {
            this.deleteSection(this.$sc);
        });

        // 섹션 수정하기
        $('.schedule-section-modify').on('click', () => {
            this.modifySection(this.$sc);
        });

        // ajax 데이터 랜더링 예시
        $('.ajax-data').on('click', ($event: any) => {
            $.ajax({url: './demo/' + $($event.target).attr('data-target')})
                .done((data: any) => {
                    this.$sc.timeSchedule('setRows', data);
                });
        });

        // esc 눌렀을 때
        $('.schedule-modal-mask, .schedule-modal-wrapper, .schedule-modal-container, .schedule-modal-pop').on('keyup', (e: any) => {
            if (e.keyCode === 27) {
                this.modalClose();
            }
        });

        // esc 눌렀을 때
        $('.schedule-modal-mask').on('click', (e: any) => {
            if (e.target.className === 'schedule-modal-wrapper') {
                this.modalClose();
            }
        });

        $('.add-section-div').on('keyup', (e: any) => {
            if (e.keyCode === 13) {
                this.addSection(this.$sc);
            }
        })
    }
}
