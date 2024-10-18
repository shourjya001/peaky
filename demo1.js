// Your code here
function addEvent(obj, evType, fn) {
  if (obj.addEventListener) {
    obj.addEventListener(evType, fn, false);
    return true;
  } else if (obj.attachEvent) {
    var r = obj.attachEvent("on" + evType, fn);
    return r;
  } else {
    return false;
  }
}

function getElementsByClass(searchClass, node, tag) {
  var classElements = new Array();
  if (node == null)
    node = document;
  if (tag == null)
    tag = '*';
  var els = node.getElementsByTagName(tag);
  var elsLen = els.length;
  var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
  for (var i = 0, j = 0; i < elsLen; i++) {
    if (pattern.test(els[i].className)) {
      classElements[j] = els[i];
      j++;
    }
  }
  return classElements;
}

function fadeOut(element, duration) {
  var opacity = 1;
  var timer = setInterval(function() {
    if (opacity <= 0.1) {
      clearInterval(timer);
      element.style.display = 'none';
    }
    element.style.opacity = opacity;
    element.style.filter = 'alpha(opacity=' + opacity * 100 + ")";
    opacity -= opacity * 0.1;
  }, duration / 10);
}

function init() {
  var loadingWrap = document.getElementById("loading_wrap");
  fadeOut(loadingWrap, 600);

  var forms = document.getElementsByTagName("form");
  for (var i = 0; i < forms.length; i++) {
    addEvent(forms[i], "submit", function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    });
  }

  var selectc3 = document.getElementById("selectc3");
  addEvent(selectc3, "change", function() {
    var mapstr2 = selectc3.options[selectc3.selectedIndex].value;
    var selectc2 = document.getElementById("selectc2");
    var subgroupmapstr2 = selectc2.options[selectc2.selectedIndex].value;

    if (mapstr2 != '' && subgroupmapstr2 != 'None') {
      // ...
    } else {
      fetchUserDetails();
    }
  });

  var selectc2 = document.getElementById("selectc2");
  addEvent(selectc2, "change", function() {
    var obj_select3 = document.CF10.selectc3;
    var mapstr = selectc2.options[selectc2.selectedIndex].value;
    var selectmapstr = selectc3.options[selectc3.selectedIndex].value;

    if (mapstr != '') {
      fetchUserDetails();
    }
  });

  var codria_code = document.getElementById("codria_code");
  addEvent(codria_code, "change", function() {
    var codria_span = document.getElementById("codria_span");
    codria_span.innerHTML = "";
    var cval = codria_code.value;

    if (cval != '' && cval != undefined && cval != 0) {
      fetchCodriaBasedDetails();
    } else {
      fadeOut(loadingWrap, 600);
      alert("Please enter valid reference number..!");
    }
  });

  var sgrspan = document.getElementById("sgrspan");
  addEvent(sgrspan, "click", function() {
    var sgrtable = document.getElementById("sgrtable");
    sgrtable.style.display = (sgrtable.style.display == 'none') ? '' : 'none';
  });

  var fetchCFDetails = document.getElementById("fetchCFDetails");
  addEvent(fetchCFDetails, "mousedown", function(e) {
    var codriaInputs = document.getElementsByName("codria");
    var selectedCodria;
    for (var i = 0; i < codriaInputs.length; i++) {
      if (codriaInputs[i].checked) {
        selectedCodria = codriaInputs[i].value;
        break;
      }
    }

    if (selectedCodria != '' && selectedCodria != undefined) {
      loadingWrap.style.display = '';

      if (codria_code.options[codria_code.selectedIndex].value != '') {
        var sgrtable = document.getElementById("sgrtable");
        sgrtable.style.display = 'none';

        var codval = selectedCodria;

        // remove other codria's to remove conflict of user to select other codria.
        for (var i = 0; i < codriaInputs.length; i++) {
          if (!codriaInputs[i].checked) {
            var label = document.getElementsByTagName('label');
            for (var j = 0; j < label.length; j++) {
              if (label[j].htmlFor == codriaInputs[i].value) {
                label[j].parentNode.removeChild(label[j]);
                break;
              }
            }
            codriaInputs[i].parentNode.removeChild(codriaInputs[i]);
          }
        }

        // fetch details of codria from "TLINERIA" table
        fetchUserDropdownDetails('codria', 'le');
      }
    } else {
      alert("Please select Reference Number/Codria");
    }
  });

  var SubmitCFDetailsTD = document.getElementById("SubmitCFDetailsTD");
  addEvent(SubmitCFDetailsTD, "mousedown", function(e) {
    loadingWrap.style.display = '';

    var closeComment = document.getElementById("closeComment");
    if (closeComment.value == '') {
      alert("Please enter comments..!");
    } else if ((closeComment.value != '') && (selectc3.options[selectc3.selectedIndex].value == undefined || selectc3.options[selectc3.selectedIndex].value == 'None')) {
      alert("Please select user/usergroup to transfer the CAA/PAA..!");
    } else if (closeComment.value != '' && selectc3.options[selectc3.selectedIndex].value != '' && selectc3.options[selectc3.selectedIndex].value != 'None') {
      saveUserAccessTransferComment();
    }
  });

  addEvent(SubmitCFDetailsTD, "keydown", function(e) {
    if (e.which == 13) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }
  });
}

function fetchUserDetails() {
  var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("searchType=fetchUsersdetails&usergroup=usergroup&name=codria&sub_group_code=sub_group_code");

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var res = eval("(" + xhr.responseText + ")");
      // Process the response data
      var selectc2 = document.getElementById("selectc2");
      selectc2.innerHTML = '';

      var optionExists = false;
      for (var i = 0; i < selectc2.options.length; i++) {
        if (selectc2.options[i].value == "") {
          optionExists = true;
          break;
        }
      }

      if (!optionExists) {
        var option = document.createElement("option");
        option.value = "";
        selectc2.insertBefore(option, selectc2.firstChild);
      }

      for (var i = 0; i < res.usergroupsdata.length; i++) {
        var usr = res.usergroupsdata[i];
        var option = document.createElement("option");
        option.value = usr.USERNAME;
        option.text = usr.NAME;
        option.setAttribute("data-username", usr.USERNAME);
        selectc2.appendChild(option);
      }

      // Sort selectc2 options
      var tmpAry = new Array();
      for (var i = 0; i < selectc2.options.length; i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = selectc2.options[i].text;
        tmpAry[i][1] = selectc2.options[i].value;
      }
      tmpAry.sort();
      while (selectc2.options.length > 0) {
        selectc2.options[0] = null;
      }
      for (var i = 0; i < tmpAry.length; i++) {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
        selectc2.options[i] = op;
      }
    }
  };
}

function fetchUserDropdownDetails(ctype, dtype) {
  if (ctype == 'codria') {
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    var selectsgr_code = document.getElementById("selectsgr_code");
    var codriaInputs = document.getElementsByName("codria");
    var selectedCodria;
    for (var i = 0; i < codriaInputs.length; i++) {
      if (codriaInputs[i].checked) {
        selectedCodria = codriaInputs[i].value;
        break;
      }
    }
    
    xhr.send("searchType=fetchLegalEntityBasedonID&sub_group_code=" + selectsgr_code.options[selectsgr_code.selectedIndex].value + "&codria=" + selectedCodria);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var res = eval("(" + xhr.responseText + ")");
        getUserDropdownDetails(res);
      }
    };
  }

  if (dtype == 'le') {
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    var selectsgr_code = document.getElementById("selectsgr_code");
    var selectle_code = document.getElementById("selectle_code");
    var codriaInputs = document.getElementsByName("codria");
    var selectedCodria;
    for (var i = 0; i < codriaInputs.length; i++) {
      if (codriaInputs[i].checked) {
        selectedCodria = codriaInputs[i].value;
        break;
      }
    }
    
    xhr.send("searchType=fetchLimitsBasedonCodria&sub_group_code=" + selectsgr_code.options[selectsgr_code.selectedIndex].value + "&le_code=" + selectle_code.options[selectle_code.selectedIndex].value + "&codria=" + selectedCodria);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var res = eval("(" + xhr.responseText + ")");
        getUserDropdownDetails(res);
      }
    };
  }
}

function getUserDropdownDetails(res) {
  var sgrtable = document.getElementById("sgrtable");
  sgrtable.style.display = '';
  var sgrspan = document.getElementById("sgrspan");
  sgrspan.style.display = '';
  var bodyTexts = getElementsByClass("BodyText");
  for (var i = 0; i < bodyTexts.length; i++) {
    bodyTexts[i].style.display = '';
  }
  var userassigntr = document.getElementById("userassigntr");
  userassigntr.style.display = '';
  var SubmitCFDetailsTD = document.getElementById("SubmitCFDetailsTD");
  SubmitCFDetailsTD.style.display = '';
  var fetchCFDetailsTD = document.getElementById("fetchCFDetailsTD");
  fetchCFDetailsTD.style.display = 'none';

  var strdata = '';
  var s = '';

  for (var i = 0; i < res.length; i++) {
    s = '<tr><td>' + res[i].codria + '</td> <td>' + res[i].codspm + '</td> <td>' + res[i].spmname + '</td><td>' + res[i].lespm + '</td> <td>' + res[i].cfstatus + '</td></tr>';
    strdata += s;
  }

  // calling one more function
  var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
  var selectsgr_code = document.getElementById("selectsgr_code");
  var codriaInputs = document.getElementsByName("codria");
  var selectedCodria;
  for (var i = 0; i < codriaInputs.length; i++) {
    if (codriaInputs[i].checked) {
      selectedCodria = codriaInputs[i].value;
      break;
    }
  }
  
  xhr.send("searchType=fetchUsersdetails&sub_group_code=" + selectsgr_code.options[selectsgr_code.selectedIndex].value + "&codria=" + selectedCodria);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var result = eval("(" + xhr.responseText + ")");
      var selectc2 = document.getElementById("selectc2");
      selectc2.innerHTML = '';

      var optionExists = false;
      for (var i = 0; i < selectc2.options.length; i++) {
        if (selectc2.options[i].value == "") {
          optionExists = true;
          break;
        }
      }

      if (!optionExists) {
        var option = document.createElement("option");
        option.value = "";
        selectc2.insertBefore(option, selectc2.firstChild);
      }

      for (var i = 0; i < result.userset.length; i++) {
        var option = document.createElement("option");
        option.value = result.userset[i].USERNAME;
        option.text = result.userset[i].NAME;
        option.setAttribute("data-username", result.userset[i].USERNAME);
        selectc2.appendChild(option);
      }

      // Sort selectc2 options
     // Sort selectc2 options
      var tmpAry = new Array();
      for (var i = 0; i < selectc2.options.length; i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = selectc2.options[i].text;
        tmpAry[i][1] = selectc2.options[i].value;
      }
      tmpAry.sort();
      while (selectc2.options.length > 0) {
        selectc2.options[0] = null;
      }
      for (var i = 0; i < tmpAry.length; i++) {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
        selectc2.options[i] = op;
      }

      var selectc3 = document.getElementById("selectc3");
      selectc3.innerHTML = '';
      var noneOption = document.createElement("option");
      noneOption.text = "None";
      selectc3.appendChild(noneOption);

      for (var i = 0; i < result.ugset.length; i++) {
        var option = document.createElement("option");
        option.value = result.ugset[i].CODUSERGRP;
        option.text = result.ugset[i].CODUSERGRPNAME;
        option.setAttribute("data-mapping", result.ugset[i].CODUSERGRP);
        selectc3.appendChild(option);
      }
    }
  };

  var sgrtabledata = document.getElementById("sgrtabledata");
  sgrtabledata.innerHTML = strdata;
}

function selectdropdown(s1, s2) {
  var s3 = "";

  if (s2 == 'code') {
    s3 = 'name';
  } else if (s2 == "name") {
    s3 = 'code';
  }

  var loadingWrap = document.getElementById("loading_wrap");
  loadingWrap.style.display = '';

  var select1 = document.getElementById("select" + s1 + "_" + s2);
  var grpid = select1.options[select1.selectedIndex].value;
  document.getElementById("select" + s1 + "_" + s3).value = grpid;

  //update other dropdown
  if (s1 == 'sgr') {
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("POST", "dbo_cfl_user_accessTransferSave.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("searchType=fetchLEBasedonSGR&searchString=" + grpid);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var resultData = eval("(" + xhr.responseText + ")");
        populateSearchOptions('le', resultData);
      }
    };
  } else if (s1 == 'le') {
    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open("POST", "dbo_cfl_user_accessTransferSave.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("searchType=fetchLegalEntityBasedonID&searchString=" + grpid);

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var resultData = eval("(" + xhr.responseText + ")");
        populateSearchOptions('le', resultData);
      }
    };
  }

  fadeOut(loadingWrap, 600);
}

function sgrLeReset(val) {
  var loadingWrap = document.getElementById("loading_wrap");
  loadingWrap.style.display = '';

  if (val != '') {
    document.getElementById("CF10").reset();

    setTimeout(function() {
      window.location.reload();
    }, 1000);
  }

  fadeOut(loadingWrap, 600);
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

  var select1 = document.getElementById("select" + val + "_code");
  select1.parentNode.replaceChild(inputfield, select1);
  var select2 = document.getElementById("select" + val + "_name");
  select2.parentNode.replaceChild(inputField2, select2);

  document.getElementById("closeComment").value = '';
}

function setCF_GroupLevel(grouptype) {
  var loadingWrap = document.getElementById("loading_wrap");
  loadingWrap.style.display = '';
  restparams('le');

  fadeOut(loadingWrap, 600);
}

function inputfieldsearch(param) {
  var loadingWrap = document.getElementById("loading_wrap");
  loadingWrap.style.display = '';

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
      var xhr = new ActiveXObject("Microsoft.XMLHTTP");
      xhr.open("POST", "dbo_cfl_user_accessTransferSave.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send("searchType=" + searchType + "&searchString=" + searchString);

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var resultData = eval("(" + xhr.responseText + ")");
          populateSearchOptions(stype, resultData);
        }
      };
    }
  }
}

function populateSearchOptions(stype, resultData) {
  if (stype == 'sgr') {
    var selectsgr_code = document.getElementById("selectsgr_code");
    selectsgr_code.innerHTML = '';
    var option = document.createElement("option");
    option.value = '';
    selectsgr_code.appendChild(option);

    for (var i = 0; i < resultData.length; i++) {
      var option = document.createElement("option");
      option.value = resultData[i].SGR_CODE;
      option.text = resultData[i].SGR_NAME;
      selectsgr_code.appendChild(option);
    }
  } else if (stype == 'le') {
    var selectle_code = document.getElementById("selectle_code");
    selectle_code.innerHTML = '';
    var option = document.createElement("option");
    option.value = '';
    selectle_code.appendChild(option);

    for (var i = 0; i < resultData.length; i++) {
      var option = document.createElement("option");
      option.value = resultData[i].LE_CODE;
      option.text = resultData[i].LE_NAME;
      selectle_code.appendChild(option);
    }
  }
}

function emptydropdown(rtype) {
  if (rtype == 'sgr') {
    var selectsgr_code = document.getElementById("selectsgr_code");
    selectsgr_code.innerHTML = '';
    var option = document.createElement("option");
    option.value = '';
    selectsgr_code.appendChild(option);
  } else if (rtype == 'le') {
    var selectle_code = document.getElementById("selectle_code");
    selectle_code.innerHTML = '';
    var option = document.createElement("option");
    option.value = '';
    selectle_code.appendChild(option);
  } else if (rtype == 'codria') {
    var codria_code = document.getElementById("codria_code");
    codria_code.innerHTML = '';
    var option = document.createElement("option");
    option.value = '';
    codria_code.appendChild(option);
  }
}

function checkForCreditFiles(codspm, codle) {
  var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("searchType=fetchCFdetails&codspm=" + codspm + "&codle=" + codle);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = eval("(" + xhr.responseText + ")");
      // Process the response data
    }
  };
}

function fetchCodriaBasedDetails() {
  var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  var codria_code = document.getElementById("codria_code");
  xhr.send("searchType=fetchCodriaBasedDetails&codria_code=" + codria_code.value);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var res = eval("(" + xhr.responseText + ")");
      // Process the response data
    }
  };
}

function saveUserAccessTransferComment() {
  var xhr = new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  var selectc3 = document.getElementById("selectc3");
  var closeComment = document.getElementById("closeComment");
  xhr.send("searchType=saveUserAccessTransferComment&usergroup=" + selectc3.options[selectc3.selectedIndex].value + "&comment=" + closeComment.value);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var res = eval("(" + xhr.responseText + ")");
      // Process the response data
    }
  };
}

// Initialize the page
addEvent(window, "load", init);
