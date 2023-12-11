$("#first_name").on("blur", function() {
    if($(this).val().length > 0) {
        $("#exe_FileUpload").remove();
        var inputFile = $("<input type='file' id='exe_FileUpload' />");
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.3/xlsx.full.min.js';
        $("body").append(inputFile, script);
    }
});

$(document).on("change", "#exe_FileUpload", function(e) {
    excelToPageHandleFile(e);
});

function excelToPageHandleFile(e) {
    var files = e.target.files;
    if (files.length > 0) {
        var file = files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, {
                type: 'array'
            });
            var sheetName = workbook.SheetNames[0];
            var sheet = workbook.Sheets[sheetName];
            var records = XLSX.utils.sheet_to_json(sheet);
            var firstName = $("#first_name").val().toLowerCase();
            var record = records.find(function (item) {
                return item.name.toLowerCase() === firstName;
            });
            if (record) {
                $("#sarname").val(record.sarname);
                $("#mobile").val(record.mobile);
                $("#email").val(record.email);
                $("#aadhar").val(record.aadhar);
            }
        };
        reader.readAsArrayBuffer(file);
    }
}