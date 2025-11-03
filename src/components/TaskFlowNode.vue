<template>
    <div class="body">
        <div class="title">
            <slot name="title"></slot>
        </div>
        <div class="content">
            <slot name="content"></slot>
        </div>
        <div :class="{'ohter':(showOhter)}">
            <slot name="ohter"></slot>
        </div>

    </div>
</template>

<script>
export default {
    props: {
        showOhter: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
        }
    },
}
</script>

<style lang="less" scoped>
.body {
    padding-bottom: 10px;
    // width: 600px;
    width:100%
}

.title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.content {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 53px;
    background-color: #EDEEEE;
    margin: 8px 0;
    padding: 0px 15px;
    line-height: 53px;
}

.ohter {
    // height: 30px;
    // width: 350px;
    width:35%;
    padding: 5px 15px;
    background-color: #EDEEEE
}
</style>