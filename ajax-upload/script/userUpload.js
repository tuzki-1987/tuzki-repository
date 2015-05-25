/**
 * 上传票房 - 点击事件
 * 
 * @param obj 点击对象
 * @return
 * */
function upScheDetail(obj){
    //var cinemaID = $("#cinemaID").val();
    var upFileName = document.getElementById('viewfile').value;
    
    if(upFileName.trim() == "" || upFileName.trim().length < 1){
        tipMsg_Single(obj, 0, "请选择文件后上传", 0, '', '');
        return false;
    }else{
        if(upFileName.substring(upFileName.lastIndexOf(".") + 1, upFileName.length) != "xls" &&
        upFileName.substring(upFileName.lastIndexOf(".") + 1, upFileName.length) != "xlsx"){    // 03版".xls"、07/10/13版".xlsx"
        tipMsg_Single(obj, 0, "请上传Excel文件", 0, '', '');
        document.getElementById('viewfile').value = "";
        return false;
        }else{
        var loadImg = "<a href='javascript:;' id='loadImg' class='load_img'><img src='images/o_31.gif' width='20' height='20' /></a>";
        $("#detailIndex").empty().append(loadImg);
            
        var urlPath = "upload.html";
        var urlPath = "http://www.baidu.com";
        $.ajaxFileUpload({
            url: urlPath, //需要链接到服务器地址
            secureuri: false,
            fileElementId: 'uploadDetail', //文件选择框的id属性
            type: 'iframe',
            dataType: 'json', //服务器返回的格式（数据需要二次处理）
            success : function(data, status){
                result = jQuery.parseJSON(data);
                if(result.ret){
                    $("#loadImg").remove();
                    tipMsg_Single(obj, 0, "上传成功", 0, '', '');
                        
                        var detailTitle = "";
                        if(upFileName.indexOf("\\") != -1)
                            detailTitle = upFileName.substring(upFileName.lastIndexOf("\\") + 1, upFileName.indexOf("."));
                        else
                            detailTitle = upFileName.substring(0, upFileName.indexOf("."));
                        
                        var detailTitleHTML = "<a href='javascript:;' title='" + detailTitle + "' onclick='showDetail(this.title, 1);'>"+detailTitle+"</a>";
                        $("#detailIndex").empty().append(detailTitleHTML);
                        $(".detailIndex a").fadeIn(1000);
                        
                        document.getElementById('viewfile').value = "";
                    }else{
                        tipMsg_Single(obj, 0, "上传失败", 0, '', '');
                        document.getElementById('viewfile').value = "";
                    }
                },
                error: function(data,status){
                    // function func();
                }
            });
        }
    }
}