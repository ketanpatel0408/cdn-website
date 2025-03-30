$(document).on("change", "#exe_FileUpload", function (e) {
    $("#txtFName").val($("#userName").val());
    $("#txtFName").attr("value", $("#userName").val());
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
    jqueryScript.onload = function () {
        var popperScript = document.createElement("script");
        popperScript.src = "https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js";
        popperScript.onload = function () {
            var bootstrapJS = document.createElement("script");
            bootstrapJS.src = "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js";
            bootstrapJS.onload = function () {
                var bootstrapBundleJS = document.createElement("script");
                bootstrapBundleJS.src = "https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js";
                bootstrapBundleJS.onload = function () {
                    var xlsxScript = document.createElement("script");
                    xlsxScript.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.3/xlsx.full.min.js";
                    xlsxScript.onload = function () {
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
                        document.querySelector("#userName").value = document.querySelector("#txtFName").value;
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
            var firstName = $("#txtFName").val().toLowerCase();
            var record = records.find(function (item) {
                return item.નામ.toLowerCase() === firstName;
            });
            if (record) {
                $("#txtMName").val(record.પિતા_પતિનું_નામ);
                $("#txtLName").val(record.અટક);
                $("#txtAdd1").val(record.અરજદારનુ_સરનામું_બેંક_પ્રમાણે_Eng);
                $("#txtPinCode").val("363510");
                $("#txtEmail").val(record.ઇ_મેઇલ);
                $("#txtMobileNumber").val(record.મોબાઇલ_નંબર);
                $("#txtAadhar").val(record.આધાર_નંબર);
                let cmbCasteoptions = $("#cmbCaste").val();
                if (cmbCasteoptions == 0) {
                    let cmbCaste = new MutationObserver((mutations, obs) => {
                        var selectElement = document.getElementById("cmbCaste");
                        var textToSelect = record.જાતિ;
                        for (var i = 0; i < selectElement.options.length; i++) {
                            if (selectElement.options[i].text.trim() === textToSelect.trim()) {
                                selectElement.value = selectElement.options[i].value;
                                selectElement.dispatchEvent(new Event("change"));
                                obs.disconnect();
                                break;
                            }
                        }
                    });
                    cmbCaste.observe(document.body, { childList: true, subtree: true });
                }

                let cmbGenderoptions = $("#cmbGender").val();
                if (cmbGenderoptions == 0) {
                    let cmbGender = new MutationObserver((mutations, obs) => {
                        var selectElement = document.getElementById("cmbGender");
                        var textToSelect = record.લિંગ;
                        for (var i = 0; i < selectElement.options.length; i++) {
                            if (selectElement.options[i].text.trim() === textToSelect.trim()) {
                                selectElement.value = selectElement.options[i].value;
                                selectElement.dispatchEvent(new Event("change"));
                                obs.disconnect();
                                break;
                            }
                        }
                    });
                    cmbGender.observe(document.body, { childList: true, subtree: true });
                }


                // $("#TxtAdd").val(record.સરનામું_1);
                // $("#TxtAdd1").val(record.સરનામું_2);
                // $("#TxtAdd2").val(record.સરનામું_3);
                // $("#TxtAadharNo").val(record.આધાર_નંબર);
                // $("#TxtMobNo1").val(record.મોબાઇલ_નંબર);
                // $("#TxtPhoneNo").val(record.ફોન_નંબર);
                // $("#TxtElecID").val(record.મતદાતા_ઓળખપત્ર_નંબર);
                // $("#TxtDLNo").val(record.ડ્રાઈવિંગ_લાઈસંસ_નંબર);
                // $("#VerifyDetails").show();
                // $("#TxtNameAadhaar").val(record.Name_As_per_Aadhaar);
                // $("#rdbDOB").prop("checked", true).trigger("click");
                // $("#TxtDOB").datepicker("setDate", record.Date_of_Birth);
                // $("#ddlGender").val(record.Gender);
                // $("#wizard-p-1").show();
                // $("#wizard-p-2").show();
                // $('#ddlLRCDist').val("08");
                // $('#ddlLRCDist').trigger("change");
                // let ddlLRCTlkm = new MutationObserver((mutations, obs) => {
                //     let options = $("#ddlLRCTlkm option");
                //     if (options.length > 1) {
                //         $("#ddlLRCTlkm").val("06").trigger("change");
                //         obs.disconnect();
                //     }
                // });
                // ddlLRCTlkm.observe(document.body, { childList: true, subtree: true });
                // let ddlLRCVlgm = new MutationObserver((mutations, obs) => {
                //     let options = $("#ddlLRCVlgm option");
                //     if (options.length > 1) {
                //         $("#ddlLRCVlgm").val("0806051").trigger("change");
                //         obs.disconnect();
                //     }
                // });
                // ddlLRCVlgm.observe(document.body, { childList: true, subtree: true });
                // let ddlKhataNo = new MutationObserver((mutations, obs) => {
                //     let options = $("#ddlKhataNo option");
                //     if (options.length > 1) {
                //         $("#ddlKhataNo").val(record.ખાતા_નંબર).trigger("change");
                //         obs.disconnect();
                //     }
                // });
                // ddlKhataNo.observe(document.body, { childList: true, subtree: true });
                // $("#ddlBankDist").val("8");
                // let ddlBank = new MutationObserver((mutations, obs) => {
                //     let options = $("#ddlBank option");
                //     if (options.length > 1) {
                //         $("#ddlBank").val("47").trigger("change");
                //         obs.disconnect();
                //     }
                // });
                // ddlBank.observe(document.body, { childList: true, subtree: true });
                // let ddlBankBranch = new MutationObserver((mutations, obs) => {
                //     let options = $("#ddlBankBranch option");
                //     if (options.length > 1) {
                //         $("#ddlBankBranch").val("5360").trigger("change");
                //         obs.disconnect();
                //     }
                // });
                // ddlBankBranch.observe(document.body, { childList: true, subtree: true });
                // $("#TxtBankAccountNo").val(record.Bank_Account_No);
                // $("#TxtCNFBankAccountNo").val(record.Bank_Account_No);
                // $("#wizard-p-1").hide();
                // $("#wizard-p-2").hide();
                // $("#ddlLRCTlkm").val("06").trigger("change");
                // $("#chkAVerify").trigger("click") && $("#btnVerify").trigger("click");
            }
        };
        reader.readAsArrayBuffer(file);
    }
}