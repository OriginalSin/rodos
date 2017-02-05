// загрузчик JSONP файлов
(function () {
	window.rodos = window.rodos || {};
	var CallbackRegistry = {}; // реестр

	// при успехе вызовет onSuccess, при ошибке onError
	function scriptRequest(url, onSuccess, onError) {

	  var script = document.createElement('script');
      script.setAttribute('charset', 'UTF-8');

	  var scriptOk = false; // флаг, что вызов прошел успешно

	  // сгенерировать имя JSONP-функции для запроса
	  var callbackName = 'cb' + String(Math.random()).slice(-6);

	  // укажем это имя в URL запроса
	  url += ~url.indexOf('?') ? '&' : '?';
	  url += 'callback=CallbackRegistry.' + callbackName;

	  // ..и создадим саму функцию в реестре
	  window.rodos.jsonpCallback = CallbackRegistry[callbackName] = function(data) {
		scriptOk = true; // обработчик вызвался, указать что всё ок
		delete CallbackRegistry[callbackName]; // можно очистить реестр
        script.parentNode.removeChild(script);
		onSuccess(data); // и вызвать onSuccess
	  };

	  // эта функция сработает при любом результате запроса
	  // важно: при успешном результате - всегда после JSONP-обработчика
	  function checkCallback() {
		if (scriptOk) return; // сработал обработчик?
		delete CallbackRegistry[callbackName];
        script.parentNode.removeChild(script);
		onError(url); // нет - вызвать onError
	  }

	  // в старых IE поддерживается только событие, а не onload/onerror
	  // в теории 'readyState=loaded' означает "скрипт загрузился",
	  // а 'readyState=complete' -- "скрипт выполнился", но иногда
	  // почему-то случается только одно из них, поэтому проверяем оба
	  script.onreadystatechange = function() {
		if (this.readyState == 'complete' || this.readyState == 'loaded') {
		  this.onreadystatechange = null;
		  setTimeout(checkCallback, 0); // Вызвать checkCallback - после скрипта
		}
	  }

	  // события script.onload/onerror срабатывают всегда после выполнения скрипта
	  script.onload = script.onerror = checkCallback;
	  script.src = url;

      document.getElementsByTagName('head').item(0).appendChild(script);
	}
	window.rodos.jsonp = scriptRequest;
})();
