// Your code here
$(document).ready(function() {
  $("#loading_wrap").fadeOut("slow");

  $("form").submit(function(e) {
    e.preventDefault();
  });

  $("#selectc3").change(function() {
    mapstr2 = $("#selectc3 option:selected").val();
    subgroupmapstr2 = $("#selectc2 option:selected").val();

    if (mapstr2 != '' && subgroupmapstr2 != 'None') {
      // ...
    } else {
      fetchUser Details();
    }
  });

  $("#selectc2").change(function() {
    obj_select3 = eval("document.CF10.selectc3");
    mapstr = $("#selectc2 option:selected").val();
    selectmapstr = $("#selectc3 option:selected").val();

    if (mapstr != '') {
      fetchUser Details();
    }
  });

  $("#codria_code").change(function() {
    $("#codria_span").empty();
    cval = $("#codria_code").val();

    if (cval != '' && cval != undefined && cval != 0) {
      fetchCodriaBasedDetails();
    } else {
      $('#loading_wrap').fadeOut('slow');
      alert("Please enter valid reference number..!");
    }
  });

  $("#sgrspan").click(function() {
    $("#sgrtable").toggle();
  });

  $("#fetchCFDetails").on('mousedown', function(e) {
    if ($('input[name="codria"]:checked').val() != '' && $('input[name="codria"]:checked').val() != undefined) {
      $('#loading_wrap').show();

      if ($('#codria option:selected').val() != '') {
        $('#sgrtable').hide();

        codval = $('input[name="codria"]:checked').val();

        // remove other codria's to remove conflict of user to select other codria.
        $('input[name="codria"]').each(function() {
          if ($(this).prop("checked") == false) {
            $('label[for="' + $(this).val() + '"]').remove();
            $(this).remove();
          }
        });

        // fetch details of codria from "TLINERIA" table
        fetchUser DropdownDetails('codria', 'le');
      }
    } else {
      alert("Please select Reference Number/Codria");
    }
  });

  $("#SubmitCFDetailsTD").on('mousedown', function(e) {
    $('#loading_wrap').show();

    if ($("#closeComment").val() == '') {
      alert("Please enter comments..!");
    } else if (($("#closeComment").val() != '') && $('#selectc3 option:selected').val() == undefined || $('#selectc3 option:selected').val() == 'None') {
      alert("Please select user/usergroup to transfer the CAA/PAA..!");
    } else if ($("#closeComment").val() != '' && $('#selectc3 option:selected').val() != '' && $('#selectc3 option:selected').val() != 'None') {
      saveUser AccessTransferComment();
    }
  });

  $("#SubmitCFDetailsTD").keydown(function(e) {
    if (e.which == 13) e.preventDefault();
  });

  function fetchUser Details() {
    const url = "dbe_cfl_user_accessTransferSave.php";
    const data = {
      searchType: "fetchUsersdetails",
      usergroup: "usergroup",
      name: "codria",
      sub_group_code: "sub_group_code",
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        // Process the response data
        console.log(res);

        $('#selectc2').empty();

        var optionExists = ($('#selectc2 option[value=""]').length > 0);

        if (!optionExists) {
          $('#selectc2').prepend('<option value=""></option>');
        }

        $.each(res.usergroupsdata, function(index, usr) {
          sup = '<option data-username="' + usr.USERNAME + '" value="' + usr.USERNAME + '">' + usr.NAME + '</option>';
          $('#selectc2').append(sup);
        });

        $('#selectc2').sort();
      }
    };
  }

  function fetchUser DropdownDetails(ctype, dtype) {
    if (ctype == 'codria') {
      const dtajson = {
        searchType: 'fetchLegalEntityBasedonID',
        sub_group_code: $("#selectsgr_code option:selected").val(),
        codria: $('input[name="codria"]:checked').val(),
      };

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "dbe_cfl _user_accessTransferSave.php", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(dtajson));

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          getUserDropdownDetails(res);
        }
      };
    }

    if (dtype == 'le') {
      const dtajson = {
        searchType: 'fetchLimitsBasedonCodria',
        sub_group_code: $("#selectsgr_code option:selected").val(),
        le_code: $("#selectle_code option:selected").val(),
        codria: $('input[name="codria"]:checked').val(),
      };

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "dbe_cfl_user_accessTransferSave.php", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(dtajson));

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          getUserDropdownDetails(res);
        }
      };
    }
  }

  function getUserDropdownDetails(res) {
  $('#sgrtable').show();
  $('#sgrspan').show();
  $('.BodyText').show();
  $('#userassigntr').show();
  $('#SubmitCFDetailsTD').show();
  $('#fetchCFDetailsTD').hide();

  strdata = '';
  s = '';

  for (var i = 0; i < res.length; i++) {
    s = '<tr><td>' + res[i].codria + '</td> <td>' + res[i].codspm + '</td> <td>' + res[i].spmname + '</td><td>' + res[i].lespm + '</td> <td>' + res[i].cfstatus + '</td></tr>';
    strdata = strdata.concat(s);
  }

  // calling one more function
  var url = "dbe_cfl_user_accessTransferSave.php";
  var data = {
    searchType: 'fetchUsersdetails',
    sub_group_code: $("#selectsgr_code option:selected").val(),
    codria: $('input[name="codria"]:checked').val(),
  };

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(data));

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var result = JSON.parse(xhr.responseText);
      $('#selectc2').empty();

      var optionExists = ($('#selectc2 option[value=""]').length > 0);

      if (!optionExists) {
        $('#selectc2').prepend('<option value=""></option>');
      }

      for (var i = 0; i < result.userset.length; i++) {
        sp = '<option data-username="' + result.userset[i].USERNAME + '" value="' + result.userset[i].USERNAME + '">' + result.userset[i].NAME + '</option>';
        $('#selectc2').append(sp);
      }

      $('#selectc2').sort();

      $('#selectc3').empty();
      $('#selectc3').append("<option>None</option>");

      for (var i = 0; i < result.ugset.length; i++) {
        sup = '<option data-mapping="' + result.ugset[i].CODUSERGRP + '" value="' + result.ugset[i].CODUSERGRP + '">' + result.ugset[i].CODUSERGRPNAME + '</option>';
        $('#selectc3').append(sup);
      }
    }
  };

  $('#sgrtabledata').html(strdata);
}

function selectdropdown(s1, s2) {
  var s3 = "";

  if (s2 == 'code') {
    s3 = 'name';
  } else if (s2 == "name") {
    s3 = 'code';
  }

  $('#loading_wrap').show();

  var grpid = $("#select" + s1 + "_" + s2 + " option:selected").val();
  document.getElementById("select" + s1 + " " + s3).value = grpid;

  //update other dropdown
  if (s1 == 'sgr') {
    var url = "dbo_cfl_user_accessTransferSave.php";
    var data = {
      searchType: 'fetchLEBasedonSGR',
      searchString: grpid,
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var resultData = JSON.parse(xhr.responseText);
        populateSearchOptions('le', resultData);
      }
    };
  } else if (s1 == 'le') {
    var url = "dbo_cfl_user_accessTransferSave.php";
    var data = {
      searchType: 'fetchLegalEntityBasedonID',
      searchString: grpid,
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var resultData = JSON.parse(xhr.responseText);
        populateSearchOptions('le', resultData);
      }
    };
  }

  $('#loading_wrap').fadeOut('slow');
}

function sgrLeReset(val) {
  $('#loading_wrap').show();

  if (val != '') {
    $('#CF10').trigger("reset");

    setTimeout(function() {
      location.reload(true);
    }, 1000);
  }

  $('#loading_wrap').fadeOut('slow');
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

  $("#select" + val + "_code").replaceWith(inputfield);
  $("#select" + val + "_name").replaceWith(inputField2);

  $("#closeComment").val('');
}

function setCF_GroupLevel(grouptype) {
  $('#loading_wrap').show();
  restparams('le');

  $('#loading_wrap').fadeOut('slow');
}

function inputfieldsearch(param) {
  $("#loading_wrap").show();

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
      var url = "dbo_cfl_user_accessTransferSave.php";
      var data = {
        searchType: searchType,
        searchString: searchString,
      };

      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(data));

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var resultData = JSON.parse(xhr.responseText);
          populateSearchOptions(stype, resultData);
        }
      };
    }
  }
}
function populateSearchOptions(stype, resultData) {
  if (stype == 'sgr') {
    $('#selectsgr_code').empty();
    $('#selectsgr_code').append("<option value=''></option>");

    for (var i = 0; i < resultData.length; i++) {
      var option = document.createElement("option");
      option.value = resultData[i].SGR_CODE;
      option.text = resultData[i].SGR_NAME;
      $('#selectsgr_code').append(option);
    }
  } else if (stype == 'le') {
    $('#selectle_code').empty();
    $('#selectle_code').append("<option value=''></option>");

    for (var i = 0; i < resultData.length; i++) {
      var option = document.createElement("option");
      option.value = resultData[i].LE_CODE;
      option.text = resultData[i].LE_NAME;
      $('#selectle_code').append(option);
    }
  }
}

function emptydropdown(rtype) {
  if (rtype == 'sgr') {
    $('#selectsgr_code').empty();
    $('#selectsgr_code').append("<option value=''></option>");
  } else if (rtype == 'le') {
    $('#selectle_code').empty();
    $('#selectle_code').append("<option value=''></option>");
  } else if (rtype == 'codria') {
    $('#codria_code').empty();
    $('#codria_code').append("<option value=''></option>");
  }
}

  function checkForCreditFiles(codspm, codle) {
    const url = "dbe_cfl_user_accessTransferSave.php";
    const data = {
      searchType: "fetchCFdetails",
      codspm: codspm,
      codle: codle,
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        // Process the response data
        console.log(response);
      }
    };
  }

  function fetchCodriaBasedDetails() {
    const url = "dbe_cfl_user_accessTransferSave.php";
    const data = {
      searchType: "fetchCodriaBasedDetails",
      codria_code: $("#codria_code").val(),
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        // Process the response data
        console.log(res);
      }
    };
  }

  function saveUser AccessTransferComment() {
    const url = "dbe_cfl_user_accessTransferSave.php";
    const data = {
      searchType: "saveUserAccessTransferComment",
      usergroup: $("#selectc3 option:selected").val(),
      comment: $("#closeComment").val(),
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        // Process the response data
        console.log(res);
      }
    };
  }
});
