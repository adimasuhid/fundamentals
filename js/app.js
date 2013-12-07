(function($){
    //Data
    var books = [{title: "Public Speaking Graciously", releaseDate: "2020", keywords: "Public Speaking"},
                {title: "Knowing dusk and dawn", releaseDate: "2020", keywords: "Personal Development"},
                {title: "Code it Like its Hot", releaseDate: "2020", keywords: "Programming"},];

    //Models
    var Book = Backbone.Model.extend({
        defaults: {
            coverImage: "placeholder.png",
            title: "Some title",
            author: "Ace Dimasuhid",
            releaseDate:"2012",
            keywords: "Javascript Programming"
        }
    });

    //Collections
    var Library = Backbone.Collection.extend({
        model: Book
    });

    //Views
    var BookView = Backbone.View.extend({
        tagName: "div",
        className: "bookContainer",
        template: $("#bookTemplate").html(),

        render: function(){
            var tmpl = _.template(this.template);

            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        }
    });

    var LibraryView = Backbone.View.extend({
        el: $("#books"),

        events: {
            "click #add":"addBook"
        },

        initialize: function(){
            this.collection = new Library(books);
            this.render();

            this.collection.on("add", this.renderBook, this);
        },

        render: function(){
            var that = this;
            this.collection.each(function(item){
                that.renderBook(item);
            })
        },

        renderBook: function(item){
            var bookView = new BookView({
                model:item
            });
            this.$el.append(bookView.render().el);
        },

        addBook:function(e){
            e.preventDefault();
            var formData = {};
            var that = this;

            $("#addBook div").children("input").each(function(i, el){
                if ($(el).val() !== "") {
                    var value = $(el).val();

                    formData[el.id] = that.formValue(el.id,value);
                }
            });

            books.push(formData);

            this.collection.add(new Book(formData));
        },

        formValue: function(id, value){
            if (id == "coverImage") {
                return value.split('\\').pop();
            } else{
                return value
            }
        }
    });

    //Implementations
    var libraryView = new LibraryView();

})(jQuery);
