

FilePond.registerPlugin(
    FilePondPluginFileEncode,
    FilePondPluginImagePreview,
    FilePondPluginImageResize
)

// 樣式修改
FilePond.setOptions({
    stylePanelAspectRatio: '150:100',
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150,
})

// parse方法讓我們自動在頁面上加載 FilePond 元素
// FilePond 在<body>元素中找碴子樹中具有該類.filepond
FilePond.parse(document.body);





