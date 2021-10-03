var langfiles = ['az_AZ', 'en_US', 'ru_RU'];
var langdirectory = 'lang/';
var defaultlang = 'en-GB';
var asfEnable = true;
var loadCustomjs = false;
var langSelectId = 'selectLanguage';
function translateCustomTexts() { }

function loadjsfile(filename) {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);
    document.getElementsByTagName("head")[0].appendChild(fileref);
}

loadjsfile(langdirectory + 'langdef.js');

for (var file of langfiles) {
    loadjsfile(langdirectory + file + '.js');
}

if (asfEnable && loadCustomjs) loadjsfile(langdirectory + 'custom.js');

function getLocalLanguage() {
    if (localStorage.getItem('lang') != null)
        defaultlang = localStorage.getItem('lang');
}



function initLanguageOptions() {
    var select = document.getElementById(langSelectId);
    if (select != null) {
        var cnt = 0;
        for (var language of langfiles) {
            option = document.createElement('option');
            option.value = option.text = option.id = language.replace('_', '-');
            select.add(option);
            cnt++;
        }

        if (cnt == 0) console.log('warning: no translation defined');

        R.setLocale('langs');
        for (var language of langfiles) {
            language = language.replace('_', '-');
            document.getElementById(language).innerHTML = R(language);
        }
    }
}



function setSelectOption() {
    var select = document.getElementById(langSelectId);
    if (select != null && select.options[select.selectedIndex].value != defaultlang) {
        for (var i = 0; i < select.length; i++) {
            if (select.options[i].value == defaultlang) {
                select.selectedIndex = i;
                break;
            }
        }
    }
}



function selectedLanguageChanged() {
    var select = document.getElementById(langSelectId);
    if (select != null) {
        defaultlang = select.options[select.selectedIndex].value;
        localStorage.setItem('lang', defaultlang);
        updateLanguage();
    }
}



function isStringValid(str) {
    var valid = false;
    if (Boolean(str) && str.indexOf('%i') === -1 && str.indexOf('%s') === -1) {
        valid = true;
    }
    return valid;
}



function updateTranslation(elementId, text) {
    var matchClass = "multilang";
    var elem = document.getElementById(elementId);
    if (elem != null) {
        if (!isStringValid(text)) {
            console.log('invalid text: ' + text);
            return;
        }
        if (text === elem.id) {
            console.log('missing translation for element id: ' + text);
            return;
        }
        if ((' ' + elem.className + ' ').indexOf(' ' + matchClass + ' ') > -1) {
            elem.innerHTML = text;
            if (elem.type == "submit") elem.value = text;
        }
        else console.log('missing class ' + matchClass + ' for element id: ' + elem.id);
    }
}



function updateTranslationParameter(elementId, param) {
    updateTranslation(elementId, R(elementId, param));
}



function translatePlainTexts() {
    var matchClass = "multilang";
    var elems = document.getElementsByTagName('*');
    for (var i = 0; elems[i]; i++) {
        if ((' ' + elems[i].className + ' ').indexOf(' ' + matchClass + ' ') > -1) {
            var text = R(elems[i].id);
            if (isStringValid(text)) {
                updateTranslation(elems[i].id, text);
            }
            else if (!asfEnable) {
                console.log("invalid string '" + text + "' " + " for element id: " + elems[i].id);
                console.log("Is asf enabled? 'custom.js' loaded and are all asf strings overwritten?");
            }
        }
    }
}



function updateLanguage() {
    R.setLocale(defaultlang);
    setSelectOption();
    translatePlainTexts();
    if (asfEnable == true) {
        translateCustomTexts();
    }
}



function initLanguages() {
    initLanguageOptions();
    getLocalLanguage();
    updateLanguage();
}
