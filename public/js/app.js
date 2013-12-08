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
            keywords: "None"
        },
        idAttributes: "_id"

    });

    //Collections
    var Library = Backbone.Collection.extend({
        model: Book,
        url: '/api/books'
    });

    //Views
    var BookView = Backbone.View.extend({
        tagName: "div",
        className: "bookContainer",
        template: $("#bookTemplate").html(),

        events: {
            "click .delete":"deleteBook"
        },

        render: function(){
            var tmpl = _.template(this.template);

            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        },

        deleteBook: function(){
            this.model.destroy();
            this.remove();
        }
    });

    var LibraryView = Backbone.View.extend({
        el: $("#books"),

        events: {
            "click #add":"addBook"
        },

        initialize: function(){
            this.collection = new Library();
            this.collection.fetch();
            this.render();

            this.collection.on("add", this.renderBook, this);
            this.collection.on("remove", this.removeBook, this);
            this.collection.on("reset", this.render, this);
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

        removeBook:function(removedBook){
            var removedBookData = removedBook.attributes;

            _.each(removedBookData, function(val, key){
                if(removedBookData[key] === removedBook.defaults[key]){
                    delete removedBookData[key];
                }
            });

            this.collection.remove(removedBook);
            _.each(books, function(book){
                if(_.isEqual(book, removedBookData)){
                    books.splice(_.indexOf(books, book), 1);
                }
            });
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

            this.collection.create(formData);
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
