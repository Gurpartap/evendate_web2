var easyimage = require('easyimage'),
    gm = require('gm').subClass({imageMagick: true}),
    fs = require('fs'),
    Utils = require('./utils'),
    path = require('path'),
    Entities = require('./entities');

const IMG_WIDTHS = {
        'small': {
            'vertical': 200,
            'horizontal': 200
        },
        'medium': {
            'vertical': 320,
            'horizontal': 320
        },
        'large': {
            'vertical': null,
            'horizontal': null
        },
        square: {
            'vertical': 400,
            'horizontal': 400
        }
    },
    ORGANIZATIONS_WIDTHS = {
        'small': {
            'backgrounds': 480,
            'logos': 100
        },
        'medium': {
            'backgrounds': 854,
            'logos': 250
        },
        'large': {
            'backgrounds': 1366,
            'logos': 500
        }
    };

function ImagesResize(settings) {
    this.settings = settings;
}

ImagesResize.prototype.resizeFile = function (settings) {
    var widths = IMG_WIDTHS;
    if (settings.type == 'organization') {
        widths = ORGANIZATIONS_WIDTHS;
    }
    easyimage.resize({
        src: settings.source,
        dst: settings.destination,
        width: widths[settings.size][settings.orientation]
    })
};

ImagesResize.prototype.cropToSquare = function (settings) {
    var logger = this.settings.logger;
    easyimage.info(settings.source).then(
        function (file) {
            var rescrop_settings = {
                src: settings.source,
                dst: settings.destination,
                cropwidth: IMG_WIDTHS.square.horizontal,
                cropheight: IMG_WIDTHS.square.horizontal
            };

            if (file.width >= file.height) {
                rescrop_settings.height = 400;
                rescrop_settings.width = 400 * 16 / 9;
            } else {
                rescrop_settings.width = 400;
                rescrop_settings.height = 400 * 16 / 9;
            }
            easyimage.rescrop(rescrop_settings).then(
                function (image) {
                },
                function (err) {
                    logger.error(err);
                }
            );
        },
        function (err) {
            logger.error(err);
        }
    );
};

ImagesResize.prototype.blurImage = function (settings, cb) {
    gm(settings.src)
        .resize(500, 500)
        .contrast(-6)
        .blur(30, 20)
        .write(settings.dest, cb);
};

ImagesResize.prototype.blurNew = function (settings) {
    var _this = this,
        _logger = _this.settings.logger,
        users = Entities.users,
        client = settings.client,
        q_get_user_images =
            users
                .select(users.id, users.avatar_url)
                .from(users)
                .where(
                    users.blurred_image_url.isNull().or(users.blurred_image_url.notEquals(users.avatar_url))
                )
                .and(users.avatar_url.isNotNull())
                .and(users.avatar_url.notEquals(''))
                .limit(10)
                .toQuery();

    client.query(q_get_user_images, function (err, result) {
        if (err) return _logger.error(err);
        result.rows.forEach(function (image) {
            var img_path = settings.images.user_images + '/default/',
                blurred_path = settings.images.user_images + '/blurred/';
            Utils.downloadImageFromUrl(image.avatar_url, function (err, data, filename) {
                if (err) return _logger.error(err);
                _this.blurImage({
                    src: '../' + img_path + filename,
                    dest: '../' + blurred_path + filename
                }, function (err) {
                    if (err) return _logger.error(err);
                    var q_upd_user = users
                        .update({
                            local_avatar_filename: filename,
                            blurred_image_url: image.avatar_url
                        }).where(users.id.equals(image.id)).toQuery();
                    client.query(q_upd_user, function (err) {
                        if (err) return _logger.error(err);
                    })
                });
            }, '../' + img_path);
        });
    });
};

ImagesResize.prototype.resizeNew = function (config) {
    var _this = this,
        _logger = _this.settings.logger,
        IMAGES_PATH = '../' + config.images.events_path + '/',
        ORGANIZATIONS_IMAGES_PATH = '../' + config.images.organizations_images + '/',
        LARGE_IMAGES = 'large',
        MEDIUM_IMAGES = 'medium',
        SMALL_IMAGES = 'small',
        VERTICAL_IMAGES = 'vertical',
        HORIZONTAL_IMAGES = 'horizontal',
        SQUARE_IMAGES = 'square',
        BACKGROUND_IMAGES = 'backgrounds',
        LOGO_IMAGES = 'logos',
        organizations = Entities.organizations,
        events = Entities.events,
        client = config.client,
        q_get_changed_event_images =
            events
                .select(events.id, events.image_vertical, events.image_horizontal)
                .from(events)
                .where(
                    events.image_vertical.notEquals(events.image_vertical_resized)
                )
                .or(
                    events.image_horizontal.notEquals(events.image_horizontal_resized)
                )
                .toQuery(),

        q_get_changed_organization_images =
            organizations
                .select(organizations.id, organizations.background_img_url, organizations.img_url)
                .from(organizations)
                .where(
                    organizations.background_img_url.notEquals(organizations.background_medium_img_url)
                )
                .or(
                    organizations.background_img_url.notEquals(organizations.background_small_img_url)
                )
                .or(
                    organizations.img_url.notEquals(organizations.img_medium_url)
                )
                .or(
                    organizations.img_url.notEquals(organizations.img_small_url)
                ).toQuery();

    //Resizing event images
    client.query(q_get_changed_event_images, function (err, result) {
        var images = [];
        if (err) return _logger.error(err);
        result.rows.forEach(function (event) {

            //Make array of all images (with info about orientation)
            images.push({
                orientation: VERTICAL_IMAGES,
                filename: event.image_vertical
            });
            images.push({
                orientation: HORIZONTAL_IMAGES,
                filename: event.image_horizontal
            });

            //Store that we cropped images
            var q_upd_event = events.update({
                image_vertical_resized: event.image_vertical,
                image_horizontal_resized: event.image_horizontal
            }).where(events.id.equals(event.id)).toQuery();
            client.query(q_upd_event);
        });

        images.forEach(function (image) {
            _this.cropToSquare({
                source: IMAGES_PATH + LARGE_IMAGES + '/' + image.filename,
                destination: IMAGES_PATH + SQUARE_IMAGES + '/' + image.filename
            });
            _this.resizeFile({
                source: IMAGES_PATH + LARGE_IMAGES + '/' + value,
                destination: IMAGES_PATH + MEDIUM_IMAGES + '/' + value,
                orientation: image.orientation,
                size: MEDIUM_IMAGES
            });
            _this.resizeFile({
                source: IMAGES_PATH + LARGE_IMAGES + '/' + value,
                destination: IMAGES_PATH + SMALL_IMAGES + '/' + value,
                orientation: image.orientation,
                size: SMALL_IMAGES
            });
        })


    });

    var setNullNoImage = function (organization_id, data) {
        client.query(organizations.update(data).where(organizations.id.equals(organization_id)).toQuery());
    };

    console.log(q_get_changed_organization_images.text);

    client.query(q_get_changed_organization_images, function (err, result) {

        if (err) return _logger.error(err);
        result.rows.forEach(function (obj) {
            var logo_img_path = path.join(__dirname, ORGANIZATIONS_IMAGES_PATH + LOGO_IMAGES + '/' + LARGE_IMAGES + '/' + obj.img_url),
                background_img_path = path.join(__dirname, ORGANIZATIONS_IMAGES_PATH + BACKGROUND_IMAGES + '/' + LARGE_IMAGES + '/' + obj.background_img_url);

            console.log(logo_img_path);
            console.log(background_img_path);

            // resize background
            try {
                fs.stat(background_img_path, function (err, stats) {
                    if (err) {
                        setNullNoImage(obj.id, {
                            background_img_url: null
                        });
                        _logger.error(err);
                        return;
                    }
                    if (stats.isFile() == false) return setNullNoImage(obj.id, {
                        background_img_url: null
                    });
                    _this.resizeFile({
                        source: background_img_path,
                        destination: ORGANIZATIONS_IMAGES_PATH + BACKGROUND_IMAGES + '/' + MEDIUM_IMAGES + '/' + obj.background_img_url,
                        type: 'organization',
                        orientation: BACKGROUND_IMAGES,
                        size: MEDIUM_IMAGES
                    });

                    _this.resizeFile({
                        source: background_img_path,
                        destination: ORGANIZATIONS_IMAGES_PATH + BACKGROUND_IMAGES + '/' + SMALL_IMAGES + '/' + obj.background_img_url,
                        type: 'organization',
                        orientation: BACKGROUND_IMAGES,
                        size: SMALL_IMAGES
                    });


                    var q_upd_organization = organizations.update({
                        background_medium_img_url: obj.background_img_url,
                        background_small_img_url: obj.background_img_url
                    }).where(organizations.id.equals(obj.id)).toQuery();

                    client.query(q_upd_organization, function (err) {
                        if (err) return;
                    });
                });

                // resize logos
                fs.stat(logo_img_path, function (err, stats) {
                    if (err) {
                        setNullNoImage(obj.id, {
                            img_url: null
                        });
                        _logger.error(err);
                        return;
                    }
                    if (stats.isFile() == false)  return setNullNoImage(obj.id, {
                        img_url: null
                    });
                    _this.resizeFile({
                        source: logo_img_path,
                        destination: ORGANIZATIONS_IMAGES_PATH + BACKGROUND_IMAGES + '/' + MEDIUM_IMAGES + '/' + obj.background_img_url,
                        type: 'organization',
                        orientation: LOGO_IMAGES,
                        size: MEDIUM_IMAGES
                    });

                    _this.resizeFile({
                        source: logo_img_path,
                        destination: ORGANIZATIONS_IMAGES_PATH + BACKGROUND_IMAGES + '/' + SMALL_IMAGES + '/' + obj.background_img_url,
                        type: 'organization',
                        orientation: LOGO_IMAGES,
                        size: SMALL_IMAGES
                    });

                    var q_upd_organization = organizations.update({
                        img_medium_url: obj.img_url,
                        img_small_url: obj.img_url
                    }).where(organizations.id.equals(obj.id)).toQuery();

                    client.query(q_upd_organization, function (err) {
                        if (err) _logger.error(err);
                    });
                });
            } catch (e) {
            }

        });
    })
};

module.exports = ImagesResize;