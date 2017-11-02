'use strict';

$(document).on('scroll', function () {
    if ($(window).scrollTop() > 100) {
        $('.scroll-top-wrapper').addClass('show');
    } else {
        $('.scroll-top-wrapper').removeClass('show');
    }
});

$("#visa-cards").click(function(){
    $("#visa-cards-hider").toggle(250);
});
$("#master-cards").click(function(){
    $("#master-cards-hider").toggle(250);
});
$("#amex-cards").click(function(){
    $("#amex-cards-hider").toggle(250);
});
$("#diners-cards").click(function(){
    $("#diners-cards-hider").toggle(250);
});
$("#maestro-cards").click(function(){
    $("#maestro-cards-hider").toggle(250);
});
$("#jcb-cards").click(function(){
    $("#jcb-cards-hider").toggle(250);
});
$("#myone-cards").click(function(){
    $("#myone-cards-hider").toggle(250);
});
$("#bonus-cards").click(function(){
    $("#bonus-cards-hider").toggle(250);
});
$("#bc-cards").click(function(){
    $("#bc-cards-hider").toggle(250);
});
$("#sepa-cards").click(function(){
    $("#sepa-cards-hider").toggle(250);
});
$("#paypal-cards").click(function(){
    $("#paypal-cards-hider").toggle(250);
});
$("#twint-cards").click(function(){
    $("#twint-cards-hider").toggle(250);
});

$('a[href*=#]').click(function () {
    var id = $(this).attr('href') + '';
    if ($(this).data('toggle') === 'tab') {
        $(this).tab('show');
    } else {
        $('html, body').animate({
            scrollTop: $(id).offset().top
        }, 750, 'swing');
    }
});

$(function () {
    $('.lang-sequence, .language-sequence')
        .unwrap('pre').removeClass('language-sequence').removeClass('lang-sequence').css('background', 'none').sequenceDiagram({ theme: 'simple' });
    $('.prettyprint, code[class^=lang-], code[class^=language-]')
        .each(function (i, block) {
            hljs.highlightBlock(block);
        });
    $('section > h1 > a, section > h2 > a')
        .each(function () {
            var $a = $(this);
            if (!$a.hasClass('anchor-link')) {
                $a.addClass('anchor-link').attr('href', '#' + $a.attr('name')).append('<span class="glyphicon glyphicon-link"></span>');
            }
            $a.parent().append($a);
        });
});
