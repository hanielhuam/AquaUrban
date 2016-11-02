$(function () {

	//FIELD FORMATION:

		window.$info = $('#info');

		$.template('field', $('#field').html());

		formulary = new Form($info, function (data, form) {

			if(!form.checkErrors(data)) {

				$(location).attr('href', 'home.html');
			}
		});

		formulary.addButton($('#submit'));

		formulary.addField({id: 'username'});

		formulary.addField({id: 'password', type: 'password'});
});

//INTERFACE BUILDER:

	var Form = function (id, submitData) {

		this.fields = {};

		this.body = $(id);

		//ADDERS OF ITEMS:

			this.addField = function (data) {

				this.fields[data.id] = new Field(data, this.body);
			};

			var form = this.body;

			this.addButton = function (button) {

				button.on('click', function () {

					form.submit();
				});
			}

		this.checkErrors = function (searchResults) {

			var error = false;

			for (var index in searchResults.errors) {

				this.fields[index].$.error.html(searchResults.errors[index]);

				error = true;
			}

			return error;	
		}

		var that = this;

		this.body.on('submit', function (e) {

			e.preventDefault();

			data = {};

			$(this).find('[name]').each(function (index, value) {

				data[$(this).attr('name')] = $(this).val();
			});

			requestUser(data, that);
		});

		this.response = function (data) {

			submitData(data, this);
		}
	}

	var Field = function (data, frame) {

		data.type = def(data.type, 'text');

		$.tmpl('field', data).appendTo(frame);

		this.$ = {

			error: $('#' + data.id + '-error'),

			input: $('#' + data.id + '-input')
		};

		this.id = data.id;
	}