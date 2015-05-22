// Models
var Discussion = {
    list: function() {
        return m.request({
            method: "GET",
            url: "/api/v1/discussions"
        });
    },

    detail: function() {
        return m.request({
            method: "GET",
            url: "/api/v1/discussions/:discussionId",
            data: {discussionId: m.route.param("discussionId")}
        });
    },

    save: function(discussionData) {
        return m.request({
            method: "POST",
            url: "/api/v1/discussions",
            data: discussionData
        });
    },
}

var Comment = {
    vote: function(direction, commentId){
        return m.request({
            method: "POST",
            url:"/api/v1/vote/:direction/:commentId",
            data: {direction: direction, commentId: commentId}
        });
    },

    save: function(commentData) {
        return m.request({
            method: "POST",
            url: "/api/v1/new/comment/",
            data: commentData
        });
    },

}

// Views & Controllers
var Home = {
    controller: function() {
        var discussions = Discussion.list();
        return {
            discussions: discussions,
        };
    },

    view: function(ctrl) {
        return m("div", [
            m("h1", "Discussion Forum"),
            m("p", "Join a conversation or ", [
                m("a", {href: "/new/discussion", config: m.route}, "start a discussion"),
            ]),
            m("ul"),
            ctrl.discussions().map(function(discussion) {
                var username = discussion.username.length ? discussion.username : "Anonymous";
                var description_text = "Description: " + discussion.description + " started by " + username;
                var href ="[href='/discussion/" + discussion.id + "']"
                return m("li", [
                    m("a" + href, {config: m.route}, discussion.title),
                    m("p", description_text),
                ]);
            }),
        ]);
    },
}

var DiscussionDetail = {
    controller: function() {
        function submitComment(e) {
            e.preventDefault();

            var formObject = {
                discussion: m.route.param("discussionId"),
            };
            var fields = document.querySelectorAll("[id^='comment-']");
            Array.prototype.slice.call(fields).map(function (field) {
                formObject[field.id.slice(8)] = field.value;
            });
            Comment.save(formObject).then(function(){
                m.mount(document.getElementById("container"), DiscussionDetail);
            });

        }
        function upVote(e) {
            var comment_id = e.target.dataset.id;
            Comment.vote('up', comment_id).then(function(){
                m.mount(document.getElementById("container"), DiscussionDetail);
            });
        }

        function downVote(e) {
            var comment_id = e.target.dataset.id;
            Comment.vote('down', comment_id).then(function(){
                m.mount(document.getElementById("container"), DiscussionDetail);
            });
        }

        var discussion = Discussion.detail(m.route.param("discussionId"));

        return {
            discussion: discussion,
            submit: submitComment,
            upVote: upVote,
            downVote: downVote,
        };
    },
    view: function(ctrl) {
        var discussion = ctrl.discussion()[0];
        discussion.comment_set.sort(function(a, b) {
            return b.score - a.score;
        });
        return m("div", [
            m("h1", discussion.title),
            m("br"),
            m("p", discussion.description),
            m("textarea", {id:"comment-text", placeholder: "Type your comment here"}),
            m("br"),
            m("input", {id: "comment-username", placeholder: "Anonymous"}),
            m("button", {onclick: ctrl.submit}, "Post Comment"),
            m("p", {style: "display: none;", id: "confirm"}, "Your discussion has been submitted!"),
            m("ul", discussion.comment_set.map(function(comment) {
                var username = comment.username.length ? comment.username : "Anonymous";
                return m("li", [
                    m("span", {style: "font-weight: bold;"}, username),
                    m("p", comment.text),
                    m("button", {onclick: ctrl.upVote, 'data-id': comment.id}, "UpVote"),
                    m("button", {onclick: ctrl.downVote, 'data-id': comment.id}, "DownVote"),
                    m("span", {style: "padding: 10px;"}, comment.score)
                ]);
            }))
        ]);
    },
}

var NewDiscussion = {
    controller: function() {
        function submitDiscussion(e) {
            e.preventDefault();

            var formObject = {};
            var fields = document.querySelectorAll("[id^='discussion-']");
            Array.prototype.slice.call(fields).map(function (field) {
                formObject[field.id.slice(11)] = field.value;
            });
            Discussion.save(formObject).then(function(){
                m.route("/");
            });
        }

        return {
            submit: submitDiscussion,
        };
    },
    view: function (ctrl) {
        return m("div", [
            m("h1", "Start a Conversation"),
            m("input", {id: "discussion-title", placeholder: "Title"}),
            m("br"),
            m("input", {id: "discussion-username", placeholder: "Anonymous"}),
            m("br"),
            m("textarea", {id: "discussion-description", placeholder: "Description"}),
            m("br"),
            m("button", {onclick: ctrl.submit}, "Create Discussion"),
            m("br"),
        ]);
    }
}

m.route(document.getElementById("container"), "/", {
    "/": Home,
    "/discussion/:discussionId": DiscussionDetail,
    "/new/discussion": NewDiscussion,
});
