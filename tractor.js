$(document).on("change", "#exe_FileUpload", function (e) {
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
                $("#txtMName").val(record.પિતા_પતિનું_નામ);
                $("#txtLName").val(record.અટક);
                $("#txtAdd1").val(record.સરનામું);
                $("#txtPinCode").val(record.પિન_કોડ);
                $("#txtEmail").val(record.ઇ_મેઇલ);
                $("#txtMobileNumber").val(record.મોબાઇલ_નંબર);
                $("#txtAadhar").val(record.આધાર_નંબર);
                $("#chkAadharConfirm").prop("checked", true);
                $("#txtIFSCCode").val(record.બેંક_IFSC_કોડ);
                $("#txtBankAccountNo").val(record.બેંક_ખાતા_નંબર);
                $("#txtConfirmBankAccountNo").val(record.કન્ફર્મ_બેંક_ખાતા_નંબર);
                $("#txtBankholderName").val(record.અરજદાર_નુ_નામ_બેંક_પ્રમાણે_Eng);
                $("#txtBankAddress").val(record.અરજદારનુ_સરનામું_બેંક_પ્રમાણે_Eng);
                $("#txtRationCardNo").val(record.રેશન_કાર્ડ_નંબર);
                TractorOnloadSelection(record.જાતિ);
            }
        };
        reader.readAsArrayBuffer(file);
    }
}

function TractorOnloadSelection(જાતિ) {
    var casteMapping = {
        "એસ.સી.": "1",
        "એસ.ટી.": "2",
        "ઓ.બી.સી.": "3",
        "જનરલ": "4",
        "આર્થિક રીતે નબળા": "5"
    };
    $("#cmbCaste").val(casteMapping[જાતિ]);
    setTimeout(function() {
        __doPostBack('cmbCaste', '');
    }, casteMapping[જાતિ]);
}