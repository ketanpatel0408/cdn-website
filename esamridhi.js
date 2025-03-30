(function () {
  function loadScript(src, callback) {
    var script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  }


  loadDependencies();
  function loadDependencies(callback) {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.3/xlsx.full.min.js', callback);
  };

  $(document).on("input", "#input1", function (e) {
    var adharNumberValue = $(this).val();
    console.log("Adhar Number Input:", adharNumberValue);
  });

  function createModal() {
    var modalHTML = `
      <div id="myModal" class="modal" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog model">
          <div class="modal-content">
            <div class="modal-header border-0">
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body" style="padding-bottom: 20px;">
              <div class="row mb-5">
                <div class="col-md-12 mb-4">
                  <h4>અહીંયા નામ લખીને એક્સેલ અપલોડ કરો</h4>
                </div>
                <div class="col-md-12" style="margin-bottom: 10px">
                  <input type='text' id='adharNumber' class="form-control fc-alt" placeholder="અહીંયા આધાર નંબર લખો" />
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
    $('#myModal').modal('show');

    $(document).on("change", "#exe_FileUpload", function (e) {
      var userNameValue = $('#adharNumber').val();
      if (!userNameValue) {
        alert('એક્સેલ અપલોડ કરતા પહેલા કૃપા કરીને નામ દાખલ કરો.');
        $('#exe_FileUpload').val('');
      } else {
        excelToPageHandleFile(e);
      }
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

          var firstName = $("#adharNumber").val();
          var record = records.find(function (item) {
            return item.નામ.toLowerCase() === firstName;
          });
          if (record) {
          } else {
            alert("Record not found");
          }
        };
        reader.readAsArrayBuffer(file);
      }
    }
  }

  loadDependencies(createModal);
})();