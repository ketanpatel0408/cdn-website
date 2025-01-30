$(document).on("change", "#exe_FileUpload", function (e) {
    $("#TxtApplName").val($("#userName").val());
    $("#TxtApplName").attr("value", $("#userName").val());
    var userNameValue = $('#userName').val();
    if (!userNameValue) {
        alert('એક્સેલ અપલોડ કરતા પહેલા કૃપા કરીને નામ દાખલ કરો.');
        $('#exe_FileUpload').val('');
    } else {
        excelToPageHandleFile(e);
    }
});

function loadOtherScripts() {
    var bootstrapCSS = document.createElement("link");
    bootstrapCSS.rel = "stylesheet";
    bootstrapCSS.href = "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css";
    document.body.appendChild(bootstrapCSS);

    var jqueryScript = document.createElement("script");
    jqueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    jqueryScript.onload = function() {
        var popperScript = document.createElement("script");
        popperScript.src = "https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js";
        popperScript.onload = function() {
            var bootstrapJS = document.createElement("script");
            bootstrapJS.src = "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js";
            bootstrapJS.onload = function() {
                var bootstrapBundleJS = document.createElement("script");
                bootstrapBundleJS.src = "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js";
                bootstrapBundleJS.onload = function() {
                    var xlsxScript = document.createElement("script");
                    xlsxScript.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.3/xlsx.full.min.js";
                    xlsxScript.onload = function() {
                        var modalHTML = `
                            <div id="myModal" class="modal fade" data-backdrop="static" data-keyboard="false">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header border-0">
                                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                                        </div>
                                        <div class="modal-body">
                                            <div class="row mb-5">
                                                <div class="col-md-12 mb-4">
                                                    <h4>અહીંયા નામ લખીને એક્સેલ અપલોડ કરો</h4>
                                                </div>
                                                <div class="col-md-12 mb-4">
                                                    <input type='text' id='userName' class="form-control" placeholder="અહીંયા નામ લખો" />                                   
                                                </div>
                                                <div class="col-md-12">
                                                    <input type='file' id='exe_FileUpload' />                                   
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        document.body.insertAdjacentHTML("beforeend", modalHTML);
                        if (document.querySelector("#cmbRegCoOp")) {
                            if (document.querySelector("#cmbRegCoOp").value === "2") {
                                if (document.querySelector("#pnlRegMilkDetail")) {
                                    document.querySelector("#pnlRegMilkDetail").remove();
                                }
                            }
                        }
                        document.querySelector("#userName").value = document.querySelector("#TxtApplName").value;
                        $('#myModal').modal("show");
                    };
                    document.body.appendChild(xlsxScript);
                };
                document.body.appendChild(bootstrapBundleJS);
            };
            document.body.appendChild(bootstrapJS);
        };
        document.body.appendChild(popperScript);
    };
    document.body.appendChild(jqueryScript);
}


function excelToPageHandleFile(e) {
    $("#myModal").modal("hide");
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
            var firstName = $("#TxtApplName").val().toLowerCase();
            var record = records.find(function (item) {
                return item.નામ.toLowerCase() === firstName;
            });
            if (record) {
                $("#TxtFHName").val(record.પિતા_પતિનું_નામ);
                $("#TxtSurname").val(record.અટક);
                $("#TxtAdd").val(record.સરનામું);
                $("#TxtAdd1").val(record.સરનામું);
                $("#TxtAdd2").val(record.સરનામું);
                $("#TxtAadharNo").val(record.આધાર_નંબર);
                $("#TxtMobNo1").val(record.મોબાઇલ_નંબર);
                $("#TxtPhoneNo").val(record.ફોન_નંબર);
                $("#TxtElecID").val(record.મતદાતા_ઓળખપત્ર_નંબર);
                $("#TxtDLNo").val(record.ડ્રાઈવિંગ_લાઈસંસ_નંબર);
                $("#TxtNameAadhaar").val(record.Name_As_per_Aadhaar);
                $("#TxtDOB").datepicker("setDate", record.Date_of_Birth);
                $("#ddlGender option:selected").text(record.Date_of_Birth);
            }
        };
        reader.readAsArrayBuffer(file);
    }
}