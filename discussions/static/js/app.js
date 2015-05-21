//var m = require('m')


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
        }
    },

    view: function(ctrl) {
        return m("ul", "Read a discussion or ",[
            m("a", {href: "/new/discussion", config: m.route}, "Start a discussion"),
            m("br"),
            m("br"),
            ctrl.discussions().map(function(discussion) {
                var href ="[href='/discussion/" + discussion.id + "']"
                return m("li", [
                    m("a" + href, {config: m.route}, discussion.title),
                    m("p", discussion.description)
                ]);
            }),
            m("br"),

        ]);
    },
}

var DiscussionDetail = {
    controller: function() {
        function submitComment(e) {
            e.preventDefault()

            var formObject = {
                discussion: m.route.param("discussionId"),
            };
            var fields = document.querySelectorAll("[id^='comment-'");
            Array.prototype.slice.call(fields).map(function (field) {
                formObject[field.id.slice(8)] = field.value;
                field.value="";
            })
            Comment.save(formObject);
            var submitted = document.querySelector('#confirm');
            submitted.style.display= "inline";
        }
        function upVote(e) {
            var comment_id = e.target.dataset.id;
            var score_id = "score-" + comment_id;
            var submitted = document.getElementById(score_id);
            submitted.innerHTML = parseInt(submitted.innerHTML) + 1;
            return Comment.vote('up', comment_id);
        }

        function downVote(e) {
            var comment_id = e.target.dataset.id;
            var score_id = "score-" + comment_id;
            var submitted = document.getElementById(score_id);
            submitted.innerHTML = parseInt(submitted.innerHTML) - 1;
            return Comment.vote('down', comment_id);
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
        return m("div", discussion.title, [
            m("br"),
            m("p", discussion.description),
            m("textarea", {id:"comment-text", placeholder: "Type your comment here"}),
            m("br"),
            m("input", {id: "comment-username", placeholder: "Anonymous"}),
            m("button", {onclick: ctrl.submit}, "Post Comment"),
            m("p", {style: "display: none;", id: "confirm"}, "Your discussion has been submitted!"),
            m("ul", "Comments", discussion.comment_set.map(function(comment) {
                var username = comment.username.length ? comment.username : "Anonymous";
                return m("li", [
                    m("span", {style: "font-weight: bold;"}, username),
                    m("p", comment.text),
                    m("button", {onclick: ctrl.upVote, 'data-id': comment.id}, "UpVote"),
                    m("button", {onclick: ctrl.downVote, 'data-id': comment.id}, "DownVote"),
                    m("span", {id: "score-" + comment.id, style: "padding: 10px;"}, comment.score)
                ])
            }))
        ]);
    },
}

var NewDiscussion = {
    controller: function() {
        function submitDiscussion(e) {
            e.preventDefault()

            var formObject = {};
            var fields = document.querySelectorAll("input[id^='discussion-'");
            Array.prototype.slice.call(fields).map(function (field) {
                formObject[field.id.slice(11)] = field.value;
                field.value="";
            })
            Discussion.save(formObject);
            var submitted = document.querySelector('#confirm')
            submitted.style.display= "inline";
        }
        return {
            submit: submitDiscussion,
        };
    },
    view: function (ctrl) {
        return m("div", [
            m("input", {id: "discussion-title", placeholder: "Title"}),
            m("br"),
            m("input", {id: "discussion-username", placeholder: "Anonymous"}),
            m("br"),
            m("input", {id: "discussion-description", placeholder: "Description"}),
            m("br"),
            m("button", {onclick: ctrl.submit}, "Create Discussion"),
            m("br"),
            m("a", {href: "/", c: m.route}, "Return to the Homepage"),
            m("br"),
            m("p", {style: "display: none;", id: "confirm"}, "Your discussion has been submitted!"),
        ])
    }

}

m.route(document.getElementById("container"), "/", {
    "/": Home,
    "/discussion/:discussionId": DiscussionDetail,
    "/new/discussion": NewDiscussion,
});