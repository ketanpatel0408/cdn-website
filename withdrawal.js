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

$(document).ready(function () {
    $("body").append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" />');
    $.getScript('https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js', function () {
        $.getScript('https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.min.js', function () {
            $.getScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.3/xlsx.full.min.js', function () {
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
                $("body").append(modalHTML);
                if ($("#cmbRegCoOp").val() == "2") {
                    $("#pnlRegMilkDetail").remove();
                }
                $("#userName").val($("#txtFName").val());
                $("#myModal").modal("show");
            });
        });
    });
});


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
                TractorOnloadSelection(
                    record.જાતિ.trim(),
                    record.લિંગ.trim(),
                    record.જીલ્લો.trim(),
                    record.તાલુકો.trim(),
                    record.ગામ.trim(),
                    record.દિવ્યાંગ_છો_કે_કેમ.trim(),
                );
            }
        };
        reader.readAsArrayBuffer(file);
    }
}

function TractorOnloadSelection(જાતિ, લિંગ, જીલ્લો, તાલુકો, ગામ, દિવ્યાંગ_છો_કે_કેમ) {
    var PhysicialHandicapped = {
        "ના": "2",
        "હા": "1",
    };
    if ($("#cmbPhysicialHandicapped").val() != PhysicialHandicapped[દિવ્યાંગ_છો_કે_કેમ]) {
        $("#cmbPhysicialHandicapped").val(PhysicialHandicapped[દિવ્યાંગ_છો_કે_કેમ]);
    }

    var FarmerCategory = {
        "નાના ( ૧.૦ થી ૨.૦ હે. )": "1",
        "સીમાંત ( ૧.૦ હે. કે તેથી ઓછા )": "2",
        "મોટા ( ૨.૦ હે. થી વધુ )": "3",
    };

    var casteMapping = {
        "એસ.સી.": "1",
        "એસ.ટી.": "2",
        "ઓ.બી.સી.": "3",
        "જનરલ": "4",
        "આર્થિક રીતે નબળા": "5"
    };
    if ($("#cmbCaste").val() != casteMapping[જાતિ]) {
        $("#cmbCaste").val(casteMapping[જાતિ]);
        setTimeout(function () {
            __doPostBack('cmbCaste', '');
        }, 0);
    }

    var GenderMapping = {
        "પુરુષ": "1",
        "સ્ત્રી": "2",
    };
    if ($("#cmbGender").val() != GenderMapping[લિંગ]) {
        $("#cmbGender").val(GenderMapping[લિંગ]);
    }

    var District = {
        "સુરેન્દ્રનગર": "08",
    };

    if ($("#cmbDistBasicDetails").val() != District[જીલ્લો]) {
        $("#cmbDistBasicDetails").val(District[જીલ્લો]);
        setTimeout(function () {
            __doPostBack('cmbDistBasicDetails', '');
        }, 0);
    }

    var Taluko = {
        "મૂળી": "06",
    };

    if ($("#cmbTalukaBasicDetails").val() != Taluko[તાલુકો]) {
        $("#cmbTalukaBasicDetails").val(Taluko[તાલુકો]);
        setTimeout(function () {
            __doPostBack('cmbTalukaBasicDetails', '');
        }, 0);
    }

    var Village = {
        "ધરમેન્દ્રગઢ": "0806051",
    };

    if ($("#cmbVlgBasicDetails").val() != Village[ગામ]) {
        $("#cmbVlgBasicDetails").val(Village[ગામ]);
        setTimeout(function () {
            __doPostBack('cmbVlgBasicDetails', '');
        }, 0);
    }

    if ($("#cmbMilkCoOpDist").find('option:selected').text() == "-- જીલ્લો પસંદ કરો --") {
        if ($("#cmbMilkCoOpDist").val() != District[જીલ્લો]) {
            $("#cmbMilkCoOpDist").val(District[જીલ્લો]);
            setTimeout(function () {
                __doPostBack('cmbMilkCoOpDist', '');
            }, 0);
        }
    }

    if ($("#cmbMilkCoOpDist").find('option:selected').text() !== "-- જીલ્લો પસંદ કરો --") {
        if ($("#cmbMilkCoOpTaluka").val() != Taluko[તાલુકો]) {
            $("#cmbMilkCoOpTaluka").val(Taluko[તાલુકો]);
            setTimeout(function () {
                __doPostBack('cmbMilkCoOpTaluka', '');
            }, 0);
        }
    }
    
    if($("#cmbMilkCoOpTaluka").find('option:selected').text() !== "-- તાલુકો પસંદ કરો --") {
        $("#cmbMilkCoOpSociety").val("10823");
    }

    if ($("#cmbBank").val() == "0") {
        if ($("#txtIFSCCode").val() !== "") {
            $('#btnSearchBankBranch').click();
            WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions("btnSearchBankBranch", "", true, "", "", false, false));
        }
    }

    if ($("#cmbBank").val() == "0") {
        $('#cmbBank option').each(function () {
            if ($(this).val() !== "0") {
                $("#cmbBank").val($(this).val());
                setTimeout(function () {
                    __doPostBack('cmbBank', '');
                }, 0);
            }
        });
    }

    if ($("#cmbBankDist").find('option:selected').text() == "-- જીલ્લો પસંદ કરો --" && $("#cmbBank").val() !== "0") {
        $('#cmbBankDist option').each(function () {
            if ($(this).val() !== "0") {
                $("#cmbBankDist").val($(this).val());
                setTimeout(function () {
                    __doPostBack('cmbBankDist', '');
                }, 0);
            }
        });
    }

    if ($("#cmbBankDist").val() == "08") {
        if ($("#cmbBankBranch").val() == "0") {
            $('#cmbBankBranch option').each(function () {
                if ($(this).val() !== "0") {
                    $("#cmbBankBranch").val($(this).val());
                }
            });
        }
    }
}