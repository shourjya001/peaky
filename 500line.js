window.onload = function() {
    document.getElementById("loading_wrap").style.display = "none";

    var forms = document.getElementsByTagName("form");
    for (var i = 0; i < forms.length; i++) {
        forms[i].onsubmit = function(e) {
            if (e.preventDefault) e.preventDefault();
            return false;
        };
    }

    document.getElementById("selectc3").onchange = handleSelectC3Change;
    document.getElementById("selectc2").onchange = handleSelectC2Change;
    document.getElementById("codria_code").onchange = handleCodriaCodeChange;
    document.getElementById("sgrspan").onclick = toggleSgrTable;
    document.getElementById("fetchCFDetails").onmousedown = handleFetchCFDetails;
    document.getElementById("SubmitCFDetailsTD").onmousedown = handleSubmitCFDetails;
};

function handleSelectC3Change() {
    var mapstr2 = document.getElementById("selectc3").value;
    var subgroupmapstr2 = document.getElementById("selectc2").value;

    if (mapstr2 != '' && subgroupmapstr2 != 'None') {
        // ... (your logic here)
    } else {
        fetchUserDetails();
    }
}

function handleSelectC2Change() {
    var mapstr = document.getElementById("selectc2").value;
    if (mapstr != '') {
        fetchUserDetails();
    }
}

function handleCodriaCodeChange() {
    var codeSpan = document.getElementById("codria_span");
    while (codeSpan.firstChild) {
        codeSpan.removeChild(codeSpan.firstChild);
    }

    var cval = document.getElementById("codria_code").value;

    if (cval != '' && cval != undefined && cval != '0') {
        fetchCodriaBasedDetails();
    } else {
        document.getElementById('loading_wrap').style.display = 'none';
        alert("Please enter valid reference number..!");
    }
}

function toggleSgrTable() {
    var table = document.getElementById("sgrtable");
    table.style.display = (table.style.display == "none") ? "" : "none";
}

function handleFetchCFDetails() {
    var selectedCodria = document.querySelector('input[name="codria"]:checked');
    if (selectedCodria && selectedCodria.value != '') {
        document.getElementById('loading_wrap').style.display = '';

        if (document.getElementById('codria').value != '') {
            document.getElementById('sgrtable').style.display = 'none';

            var codval = selectedCodria.value;

            var codriaInputs = document.getElementsByName("codria");
            for (var i = 0; i < codriaInputs.length; i++) {
                if (!codriaInputs[i].checked) {
                    var label = document.querySelector('label[for="' + codriaInputs[i].value + '"]');
                    if (label) label.parentNode.removeChild(label);
                    codriaInputs[i].parentNode.removeChild(codriaInputs[i]);
                }
            }

            fetchUserDropdownDetails('codria', 'le');
        }
    } else {
        alert("Please select Reference Number/Codria");
    }
}

function handleSubmitCFDetails() {
    document.getElementById('loading_wrap').style.display = '';

    var closeComment = document.getElementById("closeComment").value;
    var selectedUser = document.getElementById("selectc3").value;

    if (closeComment == '') {
         alert("Please enter comments..!");
    } else if (closeComment != '' && selectedUser == '' || selectedUser == 'None') {
        alert("Please select user/usergroup to transfer the CAA/PAA..!");
    } else if (closeComment != '' && selectedUser != '' && selectedUser != 'None') {
        saveUserAccessTransferComment();
    }
}

function fetchUserDetails() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("searchType=fetchUsersdetails&usergroup=usergroup&name=codria&sub_group_code=sub_group_code");

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = xhr.responseText;
            // Process the response data
            console.log(response);
        }
    };
}

function fetchUserDropdownDetails(ctype, dtype) {
    if (ctype == 'codria') {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("searchType=fetchLegalEntityBasedonID&sub_group_code=" + document.getElementById('selectsgr_code').value + "&codria=" + document.querySelector('input[name="codria"]:checked').value);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = xhr.responseText;
                // Process the response data
                console.log(response);
            }
        };
    }

    if (dtype == 'le') {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("searchType=fetchLimitsBasedonCodria&sub_group_code=" + document.getElementById('selectsgr_code').value + "&le_code=" + document.getElementById('selectle_code').value + "&codria=" + document.querySelector('input[name="codria"]:checked').value);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = xhr.responseText;
                // Process the response data
                console.log(response);
            }
        };
    }
}

function getUserDropdownDetails(response) {
    document.getElementById('sgrtable').style.display = '';
    document.getElementById('sgrspan').style.display = '';
    document.getElementById('BodyText').style.display = '';
    document.getElementById('userassigntr').style.display = '';
    document.getElementById('SubmitCFDetailsTD').style.display = '';
    document.getElementById('fetchCFDetailsTD').style.display = 'none';

    var strdata = '';
    var s = '';

    for (var i = 0; i < response.length; i++) {
        s = '<tr><td>' + response[i].codria + '</td> <td>' + response[i].codspm + '</td> <td>' + response[i].spmname + '</td><td>' + response[i].lespm + '</td> <td>' + response[i].cfstatus + '</td></tr>';
        strdata = strdata.concat(s);
    }

    document.getElementById('sgrtabledata').innerHTML = strdata;
}

function saveUserAccessTransferComment() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("searchType=saveUserAccessTransferComment&usergroup=" + document.getElementById('selectc3').value + "&comment=" + document.getElementById('closeComment').value);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = xhr.responseText;
            // Process the response data
            console.log(response);
        }
    };
}

function selectdropdown(s1, s2) {
    var s3 = '';
    if (s2 == 'code') {
        s3 = 'name';
    } else if (s2 == "name") {
        s3 = 'code';
    }

    document.getElementById("select" + s1 + " " + s3).value = document.getElementById("select" + s1 + "_" + s2 + " option:selected").value;

    if (s1 == 'sgr') {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "dbo_cfl_user_accessTransferSave.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("searchType=fetchLEBasedonSGR&searchString=" + document.getElementById("select" + s1 + "_" + s2 + " option:selected").value);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var resultData = xhr.responseText;
                populateSearchOptions('le', resultData);
            }
        };
    } else if (s1 == 'le') {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "dbo_cfl_user_accessTransferSave.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("searchType=fetchLegalEntityBasedonID&searchString=" + document.getElementById("select" + s1 + "_" + s2 + " option:selected").value);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var resultData = xhr.responseText;
                populateSearchOptions('le', resultData);
            }
        };
    }
}

function sgrLeReset(val) {
    document.getElementById('loading_wrap').style.display = '';

    if (val != '') {
        document.getElementById('CF10').reset();

        setTimeout(function() {
            location.reload(true);
        }, 1000);
    }

    document.getElementById('loading_wrap').style.display = 'none';
}

function restparams(val) {
    var inputfield = document.createElement("input");
    inputfield.id = "txt" + val + "_code";
    inputfield.name = "txt" + val + "_code";
    inputfield.onchange = function() {
        inputfieldsearch(this.id);
    };

    var inputField2 = document.createElement("input");
    inputField2.id = "txt" + val + "_name";
    inputField2.name = "txt" + val + "_name";
    inputField2.onchange = function() {
        inputfieldsearch(this.id);
    };

    document.getElementById("select" + val + "_code").parentNode.replaceChild(inputfield, document.getElementById("select" + val + "_code"));
    document.getElementById("select" + val + "_name").parentNode.replaceChild(inputField2, document.getElementById("select" + val + "_name"));

    document.getElementById("closeComment").value = '';
}

function setCF_GroupLevel(grouptype) {
    document.getElementById('loading_wrap').style.display = '';

    restparams('le');

    document.getElementById('loading_wrap').style.display = 'none';
}

function inputfieldsearch(param) {
    document.getElementById("loading_wrap").style.display = '';

    if (param == 'txtsgr_code' || param == 'txtsgr_name') {
        var searchString = '';
        var searchType = '';
        var searchParam = '';

        var stype = 'sgr';

        if (param == 'txtsgr_code') {
            searchType = 'fetchSubGroupBasedonID';
            searchString = document.getElementById("txtsgr_code").value;
        } else if (param == 'txtsgr_name') {
            searchType = 'fetchSubGroupBasedonName';
            searchString = document.getElementById("txtsgr_name").value;
        }

        if (searchType != '' && searchString != '') {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "dbo_cfl_user_accessTransferSave.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send("searchType=" + searchType + "&searchString=" + searchString);

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var resultData = xhr.responseText;
                    populateSearchOptions(stype, resultData);
                }
            };
        }
    }
}

function populateSearchOptions(stype, resultData) {
    if (stype == 'sgr') {
        document.getElementById('selectsgr_code').options.length = 0;
        document.getElementById('selectsgr_code').options[0] = new Option('', '');

        for (var i = 0; i < resultData.length; i++) {
            var option = document.createElement("option");
            option.value = resultData[i].SGR_CODE;
            option.text = resultData[i].SGR_NAME;
            document.getElementById('selectsgr_code').options.add(option);
        }
    } else if (stype == 'le') {
        document.getElementById('selectle_code').options.length = 0;
        document.getElementById('selectle_code').options[0] = new Option('', '');

        for (var i = 0; i < resultData.length; i++) {
            var option = document.createElement("option");
            option.value = resultData[i].LE_CODE;
            option.text = resultData[i].LE_NAME;
            document.getElementById('selectle_code').options.add(option);
        }
    }
}

function emptydropdown(rtype) {
    if (rtype == 'sgr') {
        document.getElementById('selectsgr_code').options.length = 0;
        document.getElementById('selectsgr_code').options[0] = new Option('', '');
    } else if (rtype == 'le') {
        document.getElementById('selectle_code').options .length = 0;
        document.getElementById('selectle_code').options[0] = new Option('', '');
    } else if (rtype == 'codria') {
        document.getElementById('codria_code').options.length = 0;
        document.getElementById('codria_code').options[0] = new Option('', '');
    }
}

function checkForCreditFiles(codspm, codle) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("searchType=fetchCFdetails&codspm=" + codspm + "&codle=" + codle);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = xhr.responseText;
            // Process the response data
            console.log(response);
        }
    };
}

function fetchCodriaBasedDetails() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("searchType=fetchCodriaBasedDetails&codria_code=" + document.getElementById("codria_code").value);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = xhr.responseText;
            // Process the response data
            console.log(response);
        }
    };
}
