define([
  "backbone",
  "jquery",
  "underscore",
  "text!templates/register.html",
  "models/user"
  ], function(Backbone, $, _, registerTemplate, UserModel) {

    var RegisterView = Backbone.View.extend({
      events: {
        'click button.register' : 'register'
      },
      initialize: function(){
        this.template = _.template(registerTemplate);
        this.user = new UserModel();

        this.user.bind('destroy', this.remove, this);

        this.errores = [];
      },
      render: function(){
        this.$el.html(this.template({
          errores: this.errores,
          user: this.user.toJSON()
        }));

        //this.delegateEvents();

        return this;
      },
      register: function(){
        var that = this;
        var $registerForm = this.$('form');

        this.user.set({
          email: $registerForm.find('input[name="email"]').val(),
          name: $registerForm.find('input[name="name"]').val(),
          password: $registerForm.find('input[name="password"]').val()
        });

        //TODO: usar user model
        //modificar backbone.sync
        $.ajax({
          url: 'http://192.168.1.233:9000/create',
          type: 'GET',
          data: this.user.toJSON(),
          dataType: 'jsonp',
          success: function(data, textStatus, xhr) {
            if(data.success){
              that.user.destroy();
              App.models.user.set({nombre: data.user.name});
              App.router.navigate("game", {trigger: true});
            }else{
              that.errores = [];

              _.each(data.errors, function(value, index){
                that.errores.push({
                  message: value.message
                })
              });

              that.render();
            }
          },
          error: function(xhr, textStatus, errorThrown) {
            alert('error');
            console.log('error');
          }
        });
      }

    });

    return RegisterView;
});
