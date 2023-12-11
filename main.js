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
            var firstName = $("#txtFName").val().toLowerCase();
            var record = records.find(function (item) {
                return item.Name.toLowerCase() === firstName;
            });
            if (record) {
                $("#txtMName").val(record.Father);
                $("#txtLName").val(record.Sarname);
                $("#txtAddress1").val(record.Address);
                $("#txtAadhar").val(record.Aadhar);
                $("#txtMobileNumber").val(record.Mobile);
                $("#txtEmail").val(record.Email);
            }
        };
        reader.readAsArrayBuffer(file);
    }
}
