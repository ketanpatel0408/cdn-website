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
                return item.નામ.toLowerCase() === firstName;
            });
            if (record) {
                $("#txtMName").val(record.પિતા/પતિનું નામ);
                $("#txtLName").val(record.અટક);
                $("#txtAdd1").val(record.સરનામું);
                $("#txtPinCode").val(record.પિન કોડ);
                $("#txtEmail").val(record.ઇ-મેઇલ);
                $("#txtMobileNumber").val(record.મોબાઇલ નંબર);
                $("#txtAadhar").val(record.આધાર નંબર);
                $("#chkAadharConfirm").prop("checked", true);
                $("#txtIFSCCode").val(record.બેંક IFSC કોડ);
                $("#txtBankAccountNo").val(record.બેંક ખાતા નંબર);
                $("#txtConfirmBankAccountNo").val(record.કન્ફર્મ બેંક ખાતા નંબર);
                $("#txtBankholderName").val(record.અરજદાર નુ નામ બેંક પ્રમાણે Eng);
                $("#txtBankAddress").val(record.અરજદાર નુ સરનામું બેંક પ્રમાણે Eng);
                $("#txtRationCardNo").val(record.રેશન કાર્ડ નંબર);
            }
        };
        reader.readAsArrayBuffer(file);
    }
}
