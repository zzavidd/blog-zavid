var faker = require('faker');
var _a = require('zavid-modules'), zDate = _a.zDate, zString = _a.zString;
var Post = require('../../static/post.static');
/** The class for Post objects and methods. */
var PostBuilder = /** @class */ (function () {
    function PostBuilder() {
        this.post = {};
    }
    PostBuilder.prototype.withTitle = function (title) {
        this.post.title = title;
        return this;
    };
    PostBuilder.prototype.withType = function (type) {
        this.post.type = type;
        return this;
    };
    PostBuilder.prototype.withTypeId = function (typeId) {
        this.post.typeId = typeId;
        return this;
    };
    PostBuilder.prototype.withContent = function (content) {
        this.post.content = content;
        return this;
    };
    PostBuilder.prototype.withStatus = function (status) {
        this.post.status = status;
        return this;
    };
    PostBuilder.prototype.withDatePublished = function (date) {
        this.post.datePublished = date;
        return this;
    };
    PostBuilder.prototype.withDomain = function (id) {
        this.post.domainId = id;
        return this;
    };
    PostBuilder.prototype.random = function (options) {
        if (options === void 0) { options = {}; }
        var _a = options.withImage, withImage = _a === void 0 ? false : _a, _b = options.numberOfContentImages, numberOfContentImages = _b === void 0 ? 0 : _b;
        this.post = {
            title: "Test: " + zString.toTitleCase(faker.company.catchPhrase()),
            type: Post.randomType(),
            typeId: faker.random.number(),
            content: faker.lorem.paragraphs().replace(/\n/g, '\n\n'),
            excerpt: faker.lorem.sentences(),
            status: Post.randomStatus(),
            datePublished: zDate.formatISODate(faker.date.past()),
            image: {
                source: withImage ? faker.image.image() : '',
                hasChanged: withImage
            },
            contentImages: new Array(numberOfContentImages).fill({
                source: faker.image.image(),
                hasChanged: true
            })
        };
        return this;
    };
    PostBuilder.prototype.withRandomExcerpt = function () {
        this.post.excerpt = faker.lorem.sentences(1);
        return this;
    };
    PostBuilder.prototype.withRandomImage = function () {
        this.post.image = {
            source: faker.image.image(),
            hasChanged: true
        };
        return this;
    };
    PostBuilder.prototype.build = function () {
        return this.post;
    };
    return PostBuilder;
}());
module.exports = PostBuilder;
