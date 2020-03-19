"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SchedulerEdulub = /** @class */ (function (_super) {
    __extends(SchedulerEdulub, _super);
    function SchedulerEdulub() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.optionForEdulub = {};
        return _this;
    }
    SchedulerEdulub.prototype.start = function () {
        _super.prototype.start.call(this, this.optionForEdulub);
        this.onEvent();
    };
    SchedulerEdulub.prototype.onEvent = function () {
        var _this = this;
        // 수정하기 클릭
        $('.schedule-modify').on('click', function () {
            _this.modifySchedule(_this.$sc);
        });
        // 취소 클릭
        $('.schedule-cancel').on('click', function () {
            _this.modalClose();
        });
        // 만들기 클릭
        $('.schedule-make').on('click', function () {
            _this.addSchedule(_this.$sc);
        });
        // 스케쥴 삭제 클릭
        $('.schedule-delete').on('click', function () {
            _this.deleteSchedule(_this.$sc);
        });
        // 섹션 추가하기
        $('.schedule-add-section').on('click', function () {
            _this.addSection(_this.$sc);
        });
        // 섹션 삭제하기
        $('.schedule-section-delete').on('click', function () {
            _this.deleteSection(_this.$sc);
        });
        // 섹션 수정하기
        $('.schedule-section-modify').on('click', function () {
            _this.modifySection(_this.$sc);
        });
        // ajax 데이터 랜더링 예시
        $('.ajax-data').on('click', function ($event) {
            $.ajax({ url: './demo/' + $($event.target).attr('data-target') })
                .done(function (data) {
                _this.$sc.timeSchedule('setRows', data);
            });
        });
        // esc 눌렀을 때
        $('.schedule-modal-mask, .schedule-modal-wrapper, .schedule-modal-container, .schedule-modal-pop').on('keyup', function (e) {
            if (e.keyCode === 27) {
                _this.modalClose();
            }
        });
        // esc 눌렀을 때
        $('.schedule-modal-mask').on('click', function (e) {
            if (e.target.className === 'schedule-modal-wrapper') {
                _this.modalClose();
            }
        });
        $('.add-section-div').on('keyup', function (e) {
            if (e.keyCode === 13) {
                _this.addSection(_this.$sc);
            }
        });
    };
    return SchedulerEdulub;
}(schedulerDemo));
