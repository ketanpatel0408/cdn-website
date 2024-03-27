$(document).ready(function () {
    $('[contenteditable="true"]').on('input', function () {
        var editedText = $(this).text();
    });

    $('#datePiker').datepicker({
        dateFormat: 'dd/mm/yy',
        onSelect: function(dateText, inst) {
            $(this).text(dateText);
        }
    }).datepicker('setDate', new Date());

    $('.normalDate').datepicker({
        dateFormat: 'dd/mm/yy',
        onSelect: function(dateText, inst) {
            $(this).text(dateText);
        }
    })
    

    var rowCount = 11;
    for (var i = 0; i < rowCount; i++) {
        var newRowHtml = '<div class="row flex">' +
            '<div class="cell align-top w-[6%] text-right border-current border-r p-1 pb-2 pt-2 HSN" contenteditable="true"></div>' +
            '<div class="cell align-top w-[37%] text-left border-current border-r p-1 pb-2 pt-2" contenteditable="true"></div>' +
            '<div class="cell align-top w-[10%] text-center border-current border-r p-1 pb-2 pt-2 HSN" contenteditable="true"></div>' +
            '<div class="cell align-top w-[8%] text-right border-current border-r p-1 pb-2 pt-2 qty" contenteditable="true"></div>' +
            '<div class="cell align-top w-[6%] text-center border-current border-r p-1 pb-2 pt-2 nos"></div>' +
            '<div class="cell align-top w-[13%] text-right border-current border-r p-1 pb-2 pt-2 rate number" contenteditable="true"></div>' +
            '<div class="cell align-top w-[7%] text-right border-current border-r p-1 pb-2 pt-2 gst number" contenteditable="false"></div>' +
            '<div class="cell align-top w-[13%] text-right p-1 pb-2 pt-2 number amount"></div>' +
            '</div>';

        $('#invoiceTable .body').append(newRowHtml);
    }
});

$(document).on('dblclick', '.gst.number', function() {
    $(this).attr('contenteditable', 'true');
});

$(document).on('blur', '.gst.number', function() {
    AmountRate($(this).text())
});



$('#invoiceTable').on('blur', '.rate', function() {
    var rate = $(this).text();
    var quntity =  parseFloat($(this).closest(".row").find(".qty").text());
    if(isNaN(quntity)) {
        alert("પેહલા કઓન્ટિટી નાખો");
        $(this).text("");
        return false;
    }
    var rate1 = rate * quntity.toString();
    rate = rate1.toString();
    var amount = $(this).closest(".row").find(".amount");
    var gst = $(this).closest(".row").find(".gst");
    amount.text(rate);
    if(gst.text() == "") {
        gst.text("18.00");
    }

    if (rate !== "" && !isNaN(rate)) {
        if (rate.indexOf('.') === -1) {
            amount.text(parseFloat(rate).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        } else {
            var value = amount.text().replace(',', '');
            var decimalIndex = value.indexOf('.');
            value = value.replace(/[^\d.]/g, '');
            if (decimalIndex !== -1 && value.substring(decimalIndex + 1).length > 2) {
                value = value.substring(0, decimalIndex + 3);
            }
            amount.text(parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        }
    }

    AmountRate(gst.text());
    if(rate == "") {
        amount.text("");
        gst.text("");
    }
});


$('#invoiceTable').on('blur', '.number', function() {
    if($(this).text() !== "") {
        var value = $(this).text().replace(',', '');
        var decimalIndex = value.indexOf('.');
        value = value.replace(/[^\d.]/g, '');
        if (decimalIndex !== -1 && value.substring(decimalIndex + 1).length > 2) {
            value = value.substring(0, decimalIndex + 3);
        }
        $(this).text(parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    }
});

$('#invoiceTable').on('blur', '.qty', function() {
    if($(this).text() !== "") {
        var value = $(this).text().replace(',', '');
        var decimalIndex = value.indexOf('.');
        value = value.replace(/[^\d.]/g, '');
        if (decimalIndex !== -1 && value.substring(decimalIndex + 1).length > 3) {
            value = value.substring(0, decimalIndex + 4);
        }
        $(this).text(parseFloat(value).toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        if($(this).closest(".row").find(".nos").text() == "") {
            $(this).closest(".row").find(".nos").text("Nos.")
        }
    }
});

$('#invoiceTable').on('focus', '.qty, .number', function() {
    if($(this).text() !== "") {
        var value = $(this).text().replace(/[,.]0*$/, '');
        $(this).text(value);
    }
});


function AmountRate(gst) {
    var subtotal = 0.00;
    var Qty = 0;
    $('#invoiceTable .body .row').each(function () {
        if ($(this).text() !== "") {
            var amountText = $(this).find('.cell:last').text().trim();
            var amount = parseFloat(amountText.replace(/[^\d.-]/g, ''));
            subtotal += amount;

            var QtyText = parseFloat($(this).find('.qty').text());
            Qty += QtyText;
        }
    });

    if (isNaN(subtotal)) {
        subtotal = 0.00;
    }

    if (isNaN(Qty)) {
        Qty = 0.000;
    }
    var gstCount = gst;
    var halfGstCount = (parseFloat(gstCount) / 2).toFixed(2);
    $("#cgstHalf, #sgstHalf").text(`${halfGstCount}%`);
    var cgst = (subtotal * parseFloat(gstCount) / 2 / 100).toFixed(2);
    var sgst = (subtotal * parseFloat(gstCount) / 2 / 100).toFixed(2);
    var totalAmount = (subtotal + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);

    var roundedTotalAmount = parseFloat(totalAmount);
    var integerPart = Math.floor(roundedTotalAmount);
    var roundedSubtotal = parseFloat(subtotal.toFixed(2));
    var roundoff = (roundedTotalAmount - roundedSubtotal).toFixed(2);
    var number = roundoff;
    var words = convertToWords(number);
    $("#totalGSTWord").text(words);
    var formattedSubtotal = roundedSubtotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    $("#totalQty").text(Qty.toFixed(3));
    $('#subTotal').text(formattedSubtotal);
    $('#TaxableAmount').text(formattedSubtotal);
    $('#cgst').text(cgst);
    $('#sgst').text(sgst);

    var formattedIntegerPart = integerPart.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    $('#totalAmount').text(formattedIntegerPart);
    var formattedNumber = parseFloat(formattedIntegerPart.replace(/,/g, ''));
    var formattedWords = convertToWordsBill(formattedNumber);
    $("#totalAmountWord").text(formattedWords);

    var roundofText = roundoff;
    var roundofValue = parseFloat(roundofText);
    var decimalPart = roundofValue - Math.floor(roundofValue);
    var formattedDecimalPart = decimalPart.toFixed(2);
    $('#roundof').text(`-${formattedDecimalPart}`);
};

function convertToWords(number) {
    var words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
                 "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

    var tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function convertLessThanOneThousand(n) {
        if (n < 20) {
            return words[n];
        }
        var digit = n % 10;
        if (n < 100) {
            return tens[Math.floor(n / 10)] + (digit ? " " + words[digit] : "");
        }
        var result = "";
        if (n >= 1000) {
            result += convertLessThanOneThousand(Math.floor(n / 1000)) + " Thousand ";
            n %= 1000;
        }
        if (n >= 100) {
            result += words[Math.floor(n / 100)] + " Hundred ";
            n %= 100;
        }
        if (n > 0) {
            if (n < 20) {
                result += words[n];
            } else {
                result += tens[Math.floor(n / 10)];
                if (n % 10 !== 0) {
                    result += " " + words[n % 10];
                }
            }
        }
        return result;
    }

    if (number === 0) {
        return "Zero";
    }

    var numArray = String(number).split('.');
    var wholePart = parseInt(numArray[0], 10);
    var paisaPart = parseInt(numArray[1] || 0, 10);

    var result = convertLessThanOneThousand(wholePart) + " ";

    if (paisaPart > 0) {
        result = convertLessThanOneThousand(wholePart) + " And ";
        result += convertLessThanOneThousand(paisaPart) + " Paise";
    } else {
        result += "";
    }

    return result + " Only";
}

function convertToWordsBill(number) {
    var words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
                 "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

    var tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function convertLessThanOneThousand(n) {
        if (n < 20) {
            return words[n];
        }
        var digit = n % 10;
        if (n < 100) {
            return tens[Math.floor(n / 10)] + (digit ? " " + words[digit] : "");
        }
        var result = "";
        if (n >= 1000) {
            result += convertLessThanOneThousand(Math.floor(n / 1000)) + " Thousand ";
            n %= 1000;
        }
        if (n >= 100) {
            result += words[Math.floor(n / 100)] + " Hundred ";
            n %= 100;
        }
        if (n > 0) {
            if (n < 20) {
                result += words[n];
            } else {
                result += tens[Math.floor(n / 10)];
                if (n % 10 !== 0) {
                    result += " " + words[n % 10];
                }
            }
        }
        return result;
    }

    if (number === 0) {
        return "Zero";
    }

    var numArray = String(number).split('.');
    var wholePart = parseInt(numArray[0], 10);
    var paisaPart = parseInt(numArray[1] || 0, 10);

    var result = convertLessThanOneThousand(wholePart) + " ";

    if (paisaPart > 0) {
        result = convertLessThanOneThousand(wholePart) + " And ";
        result += convertLessThanOneThousand(paisaPart) + " Paise";
    } else {
        result += "";
    }

    return result + " Only";
}

