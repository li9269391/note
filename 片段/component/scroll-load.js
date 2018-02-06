import $ from 'jquery'
import ScrollReveal from 'scrollreveal'
import ajax from 'common/ajax'

let scrollLoadData = {
    config: {
        url: '',
        revealId: 'loadingMore',
        initPage: 1, // 初始页码
        initPerPage: 10, // 每页多少条数据
        pageParam: 'page', // 页面码字段名
        perPageParam: 'perPage', // 每页多少条数据的字段名
        before: function () {},
        success: function () {},
        fail: function () {},
        endText: '已到底了!'
    },
    loadingLock: false,
    init: function (config) {
        $.extend(this.config, config);
        this.page = this.config.initPage;
        this.perPage = this.config.initPerPage;
        this.before = this.config.before;
        this.success = this.config.success;
        this.fail = this.config.fail;

        window.sr = ScrollReveal();
        window.sr.reveal(`#${this.config.revealId}`, {
            reset: true,
            mobile: true,
            beforeReveal: domEl => {
                this.loadData()
            }
        });
    },
    loadData: function () {
        if (this.loadingLock) {
            return
        }
        this.loadingLock = true;
        this.before(this.page);

        ajax.get(this.config.url, {
            params: {
                [this.config.pageParam]: this.page,
                [this.config.perPageParam]: this.perPage
            }
        }).then(res => {
            let result = res.data;
            this.loadingLock = false;
            if (result.code === 0) {
                this.success(this.page, result);
                this.page++;
            } else {
                this.fail(this.page, result);
            }
        })
        .catch( error => {
            this.fail(arguments);
        })
    },
    loadEnd: function () {
        this.loadingLock = false;
        let oTip = $(`<div class="load-end-tip">${this.config.endText}</div>`);
        $(`#${this.config.revealId}`).after(oTip).remove();
    }
};

export default scrollLoadData