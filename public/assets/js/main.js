$(window).load(function () { // makes sure the whole site is loaded
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(350).css({'overflow': 'visible'});    
});
$(document).ready(function () {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-yellow',
        radioClass: 'iradio_square-yellow',
        increaseArea: '20%' // optional
    });


    $('.layout-grid').on('click', function () {
        $('.layout-grid').addClass('active');
        $('.layout-list').removeClass('active');

        $('#list-type').removeClass('proerty-th-list');
        $('#list-type').addClass('proerty-th');

    });

    $('.layout-list').on('click', function () {
        $('.layout-grid').removeClass('active');
        $('.layout-list').addClass('active');

        $('#list-type').addClass('proerty-th-list');
        $('#list-type').removeClass('proerty-th');

    });

    $("#bg-slider").owlCarousel({
        navigation: false, // Show next and prev buttons
        slideSpeed: 100,
        autoPlay: 5000,
        paginationSpeed: 100,
        singleItem: true,
        mouseDrag: false,
        transitionStyle: "fade"
                // "singleItem:true" is a shortcut for:
                // items : 1, 
                // itemsDesktop : false,
                // itemsDesktopSmall : false,
                // itemsTablet: false,
                // itemsMobile : false 
    });

    $("#prop-smlr-slide_0").owlCarousel({
        navigation: false, // Show next and prev buttons
        slideSpeed: 100,
        pagination: true,
        paginationSpeed: 100,
        items: 3

    });

    $("#testimonial-slider").owlCarousel({
        navigation: false, // Show next and prev buttons
        slideSpeed: 100,
        pagination: true,
        paginationSpeed: 100,
        items: 3
    });

    $('#price-range').slider();
    $('#property-geo').slider();
    $('#min-baths').slider();
    $('#min-bed').slider();

    var RGBChange = function () {
        $('#RGB').css('background', '#FDC600')
    };

    // Advanced search toggle
    var $SearchToggle = $('.search-form .search-toggle');
    $SearchToggle.hide();

    $('.search-form .toggle-btn').on('click', function (e) {
        e.preventDefault();
        $SearchToggle.slideToggle(300);
    });

    setTimeout(function () {
        $('#counter').text('0');
        $('#counter1').text('0');
        $('#counter2').text('0');
        $('#counter3').text('0');
        setInterval(function () {
            var curval = parseInt($('#counter').text());
            var curval1 = parseInt($('#counter1').text().replace(' ', ''));
            var curval2 = parseInt($('#counter2').text());
            var curval3 = parseInt($('#counter3').text());
            if (curval <= 1007) {
                $('#counter').text(curval + 1);
            }
            if (curval1 <= 1280) {
                $('#counter1').text(sdf_FTS((curval1 + 20), 0, ' '));
            }
            if (curval2 <= 145) {
                $('#counter2').text(curval2 + 1);
            }
            if (curval3 <= 1022) {
                $('#counter3').text(curval3 + 1);
            }
        }, 2);
    }, 500);

    function sdf_FTS(_number, _decimal, _separator) {
        var decimal = (typeof (_decimal) != 'undefined') ? _decimal : 2;
        var separator = (typeof (_separator) != 'undefined') ? _separator : '';
        var r = parseFloat(_number)
        var exp10 = Math.pow(10, decimal);
        r = Math.round(r * exp10) / exp10;
        rr = Number(r).toFixed(decimal).toString().split('.');
        b = rr[0].replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "\$1" + separator);
        r = (rr[1] ? b + '.' + rr[1] : b);

        return r;
    }
/*
    $.getJSON("http://coinmac.com.ng/cproperties/wp-json/wp/v2/posts", function(result){
        $.each(result, function(i, field){
            if(i < 5){
                var fdate = $.datepicker.formatDate("d-m-yy", new Date(field.date));
                $(".footer-blog").append('<li><div class="col-md-3 col-sm-4 col-xs-4 blg-thumb p0"><a href="single.html"><img src="'+field.jetpack_featured_media_url+'"></a><span class="blg-date">'+fdate+'</span></div><div class="col-md-8  col-sm-8 col-xs-8  blg-entry"><h6><small><a href="/posts?p='+field.id+'">'+field.title.rendered+'</a></small></h6></div></li>');
            }else{
                return false;
            }
        });
    });
*/
    $('#cloneDiv').click(function(){


        // get the last DIV which ID starts with ^= "klon"
        var $div = $('div[id^="klon"]:last');        
      
        // Read the Number from that DIV's ID (i.e: 3 from "klon3")
        // And increment that number by 1
        var num = parseInt( $div.prop("id").match(/\d+/g), 10 ) +1;
      
        // Clone it and assign the new ID (i.e: from num 4 to ID "klon4")
        var $klon = $div.clone().prop('id', 'klon'+num );        
      
        // Finally insert $klon wherever you want
        $div.after( $klon.appendTo('#ame') );
      
    });  
    
    $('#cloneAdiv').click(function(){


        // get the last DIV which ID starts with ^= "klon"
        var $div = $('div[id^="alon"]:last');        
      
        // Read the Number from that DIV's ID (i.e: 3 from "klon3")
        // And increment that number by 1
        var num = parseInt( $div.prop("id").match(/\d+/g), 10 ) +1;
      
        // Clone it and assign the new ID (i.e: from num 4 to ID "klon4")
        var $klon = $div.clone().prop('id', 'alon'+num );        
      
        // Finally insert $klon wherever you want
        $div.after( $klon.appendTo('#aame') );
      
    });  

    function listOptions(elname,arrval){
        $.each(arrval, function(key, value) {   
            $('.'+elname)
                .append($("<option></option>")
                        .attr("value",value)
                        .text(value)); 
        });
    }
    
    var list = [
        'Age of home/year built',
        'Number of stories or levels',
        'Orientation (direction home faces)',
        'Utilities: gas / electric',
        'HVAC: Central heating & air conditioning, propane, gravity, floor or wall',
        'RV parking or boat storage'
    ];
    
    listOptions('amenities', list);
    
        var statelist = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Enugu','Edo','Ekiti','FCT','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfar'];
    
    listOptions('states', statelist);
    
        var citieslist = ['Abuja - FCT', 'Abadam - Borno State','Abaji - FCT','Abak - Akwa Ibom State','Abakaliki - Ebonyi State','Aba North - Abia State','Aba South - Abia State','Abeokuta North - Ogun State','Abeokuta South - Ogun State','Abi - Cross River State','Aboh Mbaise - Imo State','Abua/Odual - Rivers State','Adavi - Kogi State','Ado Ekiti - Ekiti State','Ado-Odo/Ota - Ogun State','Afijio - Oyo State','Afikpo North - Ebonyi State','Afikpo South (Edda) - Ebonyi State','Agaie - Niger State','Agatu - Benue State','Agwara - Niger State','Agege - Lagos State','Aguata - Anambra State','Ahiazu Mbaise - Imo State','Ahoada East - Rivers State','Ahoada West - Rivers State','Ajaokuta - Kogi State','Ajeromi-Ifelodun - Lagos State','Ajingi - Kano State','Akamkpa - Cross River State','Akinyele - Oyo State','Akko - Gombe State','Akoko-Edo - Edo State','Akoko North-East - Ondo State','Akoko North-West - Ondo State','Akoko South-West - Ondo State','Akoko South-East - Ondo State','Akpabuyo - Cross River State','Akuku-Toru - Rivers State','Akure North - Ondo State','Akure South - Ondo State','Akwanga - Nasarawa State','Albasu - Kano State','Aleiro - Kebbi State','Alimosho - Lagos State','Alkaleri - Bauchi State','Amuwo-Odofin - Lagos State','Anambra East - Anambra State','Anambra West - Anambra State','Anaocha - Anambra State','Andoni - Rivers State','Aninri - Enugu State','Aniocha North - Delta State','Aniocha South - Delta State','Anka - Zamfara State','Ankpa - Kogi State','Apa - Benue State','Apapa - Lagos State','Ado - Benue State','Ardo Kola - Taraba State','Arewa Dandi - Kebbi State','Argungu - Kebbi State','Arochukwu - Abia State','Asa - Kwara State','Asari-Toru - Rivers State','Askira/Uba - Borno State','Atakunmosa East - Osun State','Atakunmosa West - Osun State','Atiba - Oyo State','Atisbo - Oyo State','Augie - Kebbi State','Auyo - Jigawa State','Awe - Nasarawa State','Awgu - Enugu State','Awka North - Anambra State','Awka South - Anambra State','Ayamelum - Anambra State','Aiyedaade - Osun State','Aiyedire - Osun State','Babura - Jigawa State','Badagry - Lagos State','Bagudo - Kebbi State','Bagwai - Kano State','Bakassi - Cross River State','Bokkos - Plateau State','Bakori - Katsina State','Bakura - Zamfara State','Balanga - Gombe State','Bali - Taraba State','Bama - Borno State','Bade - Yobe State','Barkin Ladi - Plateau State','Baruten - Kwara State','Bassa - Kogi State','Bassa - Plateau State','Batagarawa - Katsina State','Batsari - Katsina State','Bauchi - Bauchi State','Baure - Katsina State','Bayo - Borno State','Bebeji - Kano State','Bekwarra - Cross River State','Bende - Abia State','Biase - Cross River State','Bichi - Kano State','Bida - Niger State','Billiri - Gombe State','Bindawa - Katsina State','Binji - Sokoto State','Biriniwa - Jigawa State','Birnin Gwari - Kaduna State','Birnin Kebbi - Kebbi State','Birnin Kudu - Jigawa State','Birnin Magaji/Kiyaw - Zamfara State','Biu - Borno State','Bodinga - Sokoto State','Bogoro - Bauchi State','Boki - Cross River State','Boluwaduro - Osun State','Bomadi - Delta State','Bonny - Rivers State','Borgu - Niger State','Boripe - Osun State','Bursari - Yobe State','Bosso - Niger State','Brass - Bayelsa State','Buji - Jigawa State','Bukkuyum - Zamfara State','Buruku - Benue State','Bungudu - Zamfara State','Bunkure - Kano State','Bunza - Kebbi State','Burutu - Delta State','Bwari - FCT','Calabar Municipal - Cross River State','Calabar South - Cross River State','Chanchaga - Niger State','Charanchi - Katsina State','Chibok - Borno State','Chikun - Kaduna State','Dala - Kano State','Damaturu - Yobe State','Damban - Bauchi State','Dambatta - Kano State','Damboa - Borno State','Dandi - Kebbi State','Dandume - Katsina State','Dange Shuni - Sokoto State','Danja - Katsina State','Dan Musa - Katsina State','Darazo - Bauchi State','Dass - Bauchi State','Daura - Katsina State','Dawakin Kudu - Kano State','Dawakin Tofa - Kano State','Degema - Rivers State','Dekina - Kogi State','Demsa - Adamawa State','Dikwa - Borno State','Doguwa - Kano State','Doma - Nasarawa State','Donga - Taraba State','Dukku - Gombe State','Dunukofia - Anambra State','Dutse - Jigawa State','Dutsi - Katsina State','Dutsin Ma - Katsina State','Eastern Obolo - Akwa Ibom State','Ebonyi - Ebonyi State','Edati - Niger State','Ede North - Osun State','Ede South - Osun State','Edu - Kwara State','Ife Central - Osun State','Ife East - Osun State','Ife North - Osun State','Ife South - Osun State','Efon - Ekiti State','Yewa North - Ogun State','Yewa South - Ogun State','Egbeda - Oyo State','Egbedore - Osun State','Egor - Edo State','Ehime Mbano - Imo State','Ejigbo - Osun State','Ekeremor - Bayelsa State','Eket - Akwa Ibom State','Ekiti - Kwara State','Ekiti East - Ekiti State','Ekiti South-West - Ekiti State','Ekiti West - Ekiti State','Ekwusigo - Anambra State','Eleme - Rivers State','Emuoha - Rivers State','Emure - Ekiti State','Enugu East - Enugu State','Enugu North - Enugu State','Enugu South - Enugu State','Epe - Lagos State','Esan Central - Edo State','Esan North-East - Edo State','Esan South-East - Edo State','Esan West - Edo State','Ese Odo - Ondo State','Esit Eket - Akwa Ibom State','Essien Udim - Akwa Ibom State','Etche - Rivers State','Ethiope East - Delta State','Ethiope West - Delta State','Etim Ekpo - Akwa Ibom State','Etinan - Akwa Ibom State','Eti Osa - Lagos State','Etsako Central - Edo State','Etsako East - Edo State','Etsako West - Edo State','Etung - Cross River State','Ewekoro - Ogun State','Ezeagu - Enugu State','Ezinihitte - Imo State','Ezza North - Ebonyi State','Ezza South - Ebonyi State','Fagge - Kano State','Fakai - Kebbi State','Faskari - Katsina State','Fika - Yobe State','Fufure - Adamawa State','Funakaye - Gombe State','Fune - Yobe State','Funtua - Katsina State','Gabasawa - Kano State','Gada - Sokoto State','Gagarawa - Jigawa State','Gamawa - Bauchi State','Ganjuwa - Bauchi State','Ganye - Adamawa State','Garki - Jigawa State','Garko - Kano State','Garun Mallam - Kano State','Gashaka - Taraba State','Gassol - Taraba State','Gaya - Kano State','Gayuk - Adamawa State','Gezawa - Kano State','Gbako - Niger State','Gboko - Benue State','Gbonyin - Ekiti State','Geidam - Yobe State','Giade - Bauchi State','Giwa - Kaduna State','Gokana - Rivers State','Gombe - Gombe State','Gombi - Adamawa State','Goronyo - Sokoto State','Grie - Adamawa State','Gubio - Borno State','Gudu - Sokoto State','Gujba - Yobe State','Gulani - Yobe State','Guma - Benue State','Gumel - Jigawa State','Gummi - Zamfara State','Gurara - Niger State','Guri - Jigawa State','Gusau - Zamfara State','Guzamala - Borno State','Gwadabawa - Sokoto State','Gwagwalada - FCT','Gwale - Kano State','Gwandu - Kebbi State','Gwaram - Jigawa State','Gwarzo - Kano State','Gwer East - Benue State','Gwer West - Benue State','Gwiwa - Jigawa State','Gwoza - Borno State','Hadejia - Jigawa State','Hawul - Borno State','Hong - Adamawa State','Ibadan North - Oyo State','Ibadan North-East - Oyo State','Ibadan North-West - Oyo State','Ibadan South-East - Oyo State','Ibadan South-West - Oyo State','Ibaji - Kogi State','Ibarapa Central - Oyo State','Ibarapa East - Oyo State','Ibarapa North - Oyo State','Ibeju-Lekki - Lagos State','Ibeno - Akwa Ibom State','Ibesikpo Asutan - Akwa Ibom State','Ibi - Taraba State','Ibiono-Ibom - Akwa Ibom State','Idah - Kogi State','Idanre - Ondo State','Ideato North - Imo State','Ideato South - Imo State','Idemili North - Anambra State','Idemili South - Anambra State','Ido - Oyo State','Ido Osi - Ekiti State','Ifako-Ijaiye - Lagos State','Ifedayo - Osun State','Ifedore - Ondo State','Ifelodun - Kwara State','Ifelodun - Osun State','Ifo - Ogun State','Igabi - Kaduna State','Igalamela Odolu - Kogi State','Igbo Etiti - Enugu State','Igbo Eze North - Enugu State','Igbo Eze South - Enugu State','Igueben - Edo State','Ihiala - Anambra State','Ihitte/Uboma - Imo State','Ilaje - Ondo State','Ijebu East - Ogun State','Ijebu North - Ogun State','Ijebu North East - Ogun State','Ijebu Ode - Ogun State','Ijero - Ekiti State','Ijumu - Kogi State','Ika - Akwa Ibom State','Ika North East - Delta State','Ikara - Kaduna State','Ika South - Delta State','Ikeduru - Imo State','Ikeja - Lagos State','Ikenne - Ogun State','Ikere - Ekiti State','Ikole - Ekiti State','Ikom - Cross River State','Ikono - Akwa Ibom State','Ikorodu - Lagos State','Ikot Abasi - Akwa Ibom State','Ikot Ekpene - Akwa Ibom State','Ikpoba Okha - Edo State','Ikwerre - Rivers State','Ikwo - Ebonyi State','Ikwuano - Abia State','Ila - Osun State','Ilejemeje - Ekiti State','Ile Oluji/Okeigbo - Ondo State','Ilesa East - Osun State','Ilesa West - Osun State','Illela - Sokoto State','Ilorin East - Kwara State','Ilorin South - Kwara State','Ilorin West - Kwara State','Imeko Afon - Ogun State','Ingawa - Katsina State','Ini - Akwa Ibom State','Ipokia - Ogun State','Irele - Ondo State','Irepo - Oyo State','Irepodun - Kwara State','Irepodun - Osun State','Irepodun/Ifelodun - Ekiti State','Irewole - Osun State','Isa - Sokoto State','Ise/Orun - Ekiti State','Iseyin - Oyo State','Ishielu - Ebonyi State','Isiala Mbano - Imo State','Isiala Ngwa North - Abia State','Isiala Ngwa South - Abia State','Isin - Kwara State','Isi Uzo - Enugu State','Isokan - Osun State','Isoko North - Delta State','Isoko South - Delta State','Isu - Imo State','Isuikwuato - Abia State','Itas/Gadau - Bauchi State','Itesiwaju - Oyo State','Itu - Akwa Ibom State','Ivo - Ebonyi State','Iwajowa - Oyo State','Iwo - Osun State','Izzi - Ebonyi State','Jaba - Kaduna State','Jada - Adamawa State','Jahun - Jigawa State','Jakusko - Yobe State','Jalingo - Taraba State','Jama\'are - Bauchi State','Jega - Kebbi State','Jema\'a - Kaduna State','Jere - Borno State','Jibia - Katsina State','Jos East - Plateau State','Jos North - Plateau State','Jos South - Plateau State','Kabba/Bunu - Kogi State','Kabo - Kano State','Kachia - Kaduna State','Kaduna North - Kaduna State','Kaduna South - Kaduna State','Kafin Hausa - Jigawa State','Kafur - Katsina State','Kaga - Borno State','Kagarko - Kaduna State','Kaiama - Kwara State','Kaita - Katsina State','Kajola - Oyo State','Kajuru - Kaduna State','Kala/Balge - Borno State','Kalgo - Kebbi State','Kaltungo - Gombe State','Kanam - Plateau State','Kankara - Katsina State','Kanke - Plateau State','Kankia - Katsina State','Kano Municipal - Kano State','Karasuwa - Yobe State','Karaye - Kano State','Karim Lamido - Taraba State','Karu - Nasarawa State','Katagum - Bauchi State','Katcha - Niger State','Katsina - Katsina State','Katsina-Ala - Benue State','Kaura - Kaduna State','Kaura Namoda - Zamfara State','Kauru - Kaduna State','Kazaure - Jigawa State','Keana - Nasarawa State','Kebbe - Sokoto State','Keffi - Nasarawa State','Khana - Rivers State','Kibiya - Kano State','Kirfi - Bauchi State','Kiri Kasama - Jigawa State','Kiru - Kano State','Kiyawa - Jigawa State','Kogi - Kogi State','Koko/Besse - Kebbi State','Kokona - Nasarawa State','Kolokuma/Opokuma - Bayelsa State','Konduga - Borno State','Konshisha - Benue State','Kontagora - Niger State','Kosofe - Lagos State','Kaugama - Jigawa State','Kubau - Kaduna State','Kudan - Kaduna State','Kuje - FCT','Kukawa - Borno State','Kumbotso - Kano State','Kumi - Taraba State','Kunchi - Kano State','Kura - Kano State','Kurfi - Katsina State','Kusada - Katsina State','Kwali - FCT','Kwande - Benue State','Kwami - Gombe State','Kware - Sokoto State','Kwaya Kusar - Borno State','Lafia - Nasarawa State','Lagelu - Oyo State','Lagos Island - Lagos State','Lagos Mainland - Lagos State','Langtang South - Plateau State','Langtang North - Plateau State','Lapai - Niger State','Lamurde - Adamawa State','Lau - Taraba State','Lavun - Niger State','Lere - Kaduna State','Logo - Benue State','Lokoja - Kogi State','Machina - Yobe State','Madagali - Adamawa State','Madobi - Kano State','Mafa - Borno State','Magama - Niger State','Magumeri - Borno State','Mai\'Adua - Katsina State','Maiduguri - Borno State','Maigatari - Jigawa State','Maiha - Adamawa State','Maiyama - Kebbi State','Makarfi - Kaduna State','Makoda - Kano State','Malam Madori - Jigawa State','Malumfashi - Katsina State','Mangu - Plateau State','Mani - Katsina State','Maradun - Zamfara State','Mariga - Niger State','Makurdi - Benue State','Marte - Borno State','Maru - Zamfara State','Mashegu - Niger State','Mashi - Katsina State','Matazu - Katsina State','Mayo Belwa - Adamawa State','Mbaitoli - Imo State','Mbo - Akwa Ibom State','Michika - Adamawa State','Miga - Jigawa State','Mikang - Plateau State','Minjibir - Kano State','Misau - Bauchi State','Moba - Ekiti State','Mobbar - Borno State','Mubi North - Adamawa State','Mubi South - Adamawa State','Mokwa - Niger State','Monguno - Borno State','Mopa Muro - Kogi State','Moro - Kwara State','Moya - Niger State','Mkpat-Enin - Akwa Ibom State','Municipal Area Council - FCT','Musawa - Katsina State','Mushin - Lagos State','Nafada - Gombe State','Nangere - Yobe State','Nasarawa - Kano State','Nasarawa - Nasarawa State','Nasarawa Egon - Nasarawa State','Ndokwa East - Delta State','Ndokwa West - Delta State','Nembe - Bayelsa State','Ngala - Borno State','Nganzai - Borno State','Ngaski - Kebbi State','Ngor Okpala - Imo State','Nguru - Yobe State','Ningi - Bauchi State','Njaba - Imo State','Njikoka - Anambra State','Nkanu East - Enugu State','Nkanu West - Enugu State','Nkwerre - Imo State','Nnewi North - Anambra State','Nnewi South - Anambra State','Nsit-Atai - Akwa Ibom State','Nsit-Ibom - Akwa Ibom State','Nsit-Ubium - Akwa Ibom State','Nsukka - Enugu State','Numan - Adamawa State','Nwangele - Imo State','Obafemi Owode - Ogun State','Obanliku - Cross River State','Obi - Benue State','Obi - Nasarawa State','Obi Ngwa - Abia State','Obio/Akpor - Rivers State','Obokun - Osun State','Obot Akara - Akwa Ibom State','Obowo - Imo State','Obubra - Cross River State','Obudu - Cross River State','Odeda - Ogun State','Odigbo - Ondo State','Odogbolu - Ogun State','Odo Otin - Osun State','Odukpani - Cross River State','Offa - Kwara State','Ofu - Kogi State','Ogba/Egbema/Ndoni - Rivers State','Ogbadibo - Benue State','Ogbaru - Anambra State','Ogbia - Bayelsa State','Ogbomosho North - Oyo State','Ogbomosho South - Oyo State','Ogu/Bolo - Rivers State','Ogoja - Cross River State','Ogo Oluwa - Oyo State','Ogori/Magongo - Kogi State','Ogun Waterside - Ogun State','Oguta - Imo State','Ohafia - Abia State','Ohaji/Egbema - Imo State','Ohaozara - Ebonyi State','Ohaukwu - Ebonyi State','Ohimini - Benue State','Orhionmwon - Edo State','Oji River - Enugu State','Ojo - Lagos State','Oju - Benue State','Okehi - Kogi State','Okene - Kogi State','Oke Ero - Kwara State','Okigwe - Imo State','Okitipupa - Ondo State','Okobo - Akwa Ibom State','Okpe - Delta State','Okrika - Rivers State','Olamaboro - Kogi State','Ola Oluwa - Osun State','Olorunda - Osun State','Olorunsogo - Oyo State','Oluyole - Oyo State','Omala - Kogi State','Omuma - Rivers State','Ona Ara - Oyo State','Ondo East - Ondo State','Ondo West - Ondo State','Onicha - Ebonyi State','Onitsha North - Anambra State','Onitsha South - Anambra State','Onna - Akwa Ibom State','Okpokwu - Benue State','Opobo/Nkoro - Rivers State','Oredo - Edo State','Orelope - Oyo State','Oriade - Osun State','Ori Ire - Oyo State','Orlu - Imo State','Orolu - Osun State','Oron - Akwa Ibom State','Orsu - Imo State','Oru East - Imo State','Oruk Anam - Akwa Ibom State','Orumba North - Anambra State','Orumba South - Anambra State','Oru West - Imo State','Ose - Ondo State','Oshimili North - Delta State','Oshimili South - Delta State','Oshodi-Isolo - Lagos State','Osisioma - Abia State','Osogbo - Osun State','Oturkpo - Benue State','Ovia North-East - Edo State','Ovia South-West - Edo State','Owan East - Edo State','Owan West - Edo State','Owerri Municipal - Imo State','Owerri North - Imo State','Owerri West - Imo State','Owo - Ondo State','Oye - Ekiti State','Oyi - Anambra State','Oyigbo - Rivers State','Oyo - Oyo State','Oyo East - Oyo State','Oyun - Kwara State','Paikoro - Niger State','Pankshin - Plateau State','Patani - Delta State','Pategi - Kwara State','Port Harcourt - Rivers State','Potiskum - Yobe State','Qua\'an Pan - Plateau State','Rabah - Sokoto State','Rafi - Niger State','Rano - Kano State','Remo North - Ogun State','Rijau - Niger State','Rimi - Katsina State','Rimin Gado - Kano State','Ringim - Jigawa State','Riyom - Plateau State','Rogo - Kano State','Roni - Jigawa State','Sabon Birni - Sokoto State','Sabon Gari - Kaduna State','Sabuwa - Katsina State','Safana - Katsina State','Sagbama - Bayelsa State','Sakaba - Kebbi State','Saki East - Oyo State','Saki West - Oyo State','Sandamu - Katsina State','Sanga - Kaduna State','Sapele - Delta State','Sardauna - Taraba State','Shagamu - Ogun State','Shagari - Sokoto State','Shanga - Kebbi State','Shani - Borno State','Shanono - Kano State','Shelleng - Adamawa State','Shendam - Plateau State','Shinkafi - Zamfara State','Shira - Bauchi State','Shiroro - Niger State','Shongom - Gombe State','Shomolu - Lagos State','Silame - Sokoto State','Soba - Kaduna State','Sokoto North - Sokoto State','Sokoto South - Sokoto State','Song - Adamawa State','Southern Ijaw - Bayelsa State','Suleja - Niger State','Sule Tankarkar - Jigawa State','Sumaila - Kano State','Suru - Kebbi State','Surulere - Oyo State','Surulere - Lagos State','Tafa - Niger State','Tafawa Balewa - Bauchi State','Tai - Rivers State','Takai - Kano State','Takum - Taraba State','Talata Mafara - Zamfara State','Tambuwal - Sokoto State','Tangaza - Sokoto State','Tarauni - Kano State','Tarka - Benue State','Tarmuwa - Yobe State','Taura - Jigawa State','Toungo - Adamawa State','Tofa - Kano State','Toro - Bauchi State','Toto - Nasarawa State','Chafe - Zamfara State','Tsanyawa - Kano State','Tudun Wada - Kano State','Tureta - Sokoto State','Udenu - Enugu State','Udi - Enugu State','Udu - Delta State','Udung-Uko - Akwa Ibom State','Ughelli North - Delta State','Ughelli South - Delta State','Ugwunagbo - Abia State','Uhunmwonde - Edo State','Ukanafun - Akwa Ibom State','Ukum - Benue State','Ukwa East - Abia State','Ukwa West - Abia State','Ukwuani - Delta State','Umuahia North - Abia State','Umuahia South - Abia State','Umu Nneochi - Abia State','Ungogo - Kano State','Unuimo - Imo State','Uruan - Akwa Ibom State','Urue-Offong/Oruko - Akwa Ibom State','Ushongo - Benue State','Ussa - Taraba State','Uvwie - Delta State','Uyo - Akwa Ibom State','Uzo-Uwani - Enugu State','Vandeikya - Benue State','Wamako - Sokoto State','Wamba - Nasarawa State','Warawa - Kano State','Warji - Bauchi State','Warri North - Delta State','Warri South - Delta State','Warri South West - Delta State','Wasagu/Danko - Kebbi State','Wase - Plateau State','Wudil - Kano State','Wukari - Taraba State','Wurno - Sokoto State','Wushishi - Niger State','Yabo - Sokoto State','Yagba East - Kogi State','Yagba West - Kogi State','Yakuur - Cross River State','Obi - Benue State','Obi - Nasarawa State','Obi Ngwa - Abia State','Obio/Akpor - Rivers State','Obokun - Osun State','Obot Akara - Akwa Ibom State','Obowo - Imo State','Obubra - Cross River State','Yala - Cross River State','Yamaltu/Deba - Gombe State','Yankwashi - Jigawa State','Yauri - Kebbi State','Yenagoa - Bayelsa State','Yola North - Adamawa State','Yola South - Adamawa State','Yorro - Taraba State','Yunusari - Yobe State','Yusufari - Yobe State','Zaki - Bauchi State','Zango - Katsina State','Zangon Kataf - Kaduna State','Zaria - Kaduna State','Zing - Taraba State','Zurmi - Zamfara State','Zuru - Kebbi State'];
    
    listOptions('cities', citieslist);
    
    /*
    $("#states").on('change', function(){
        filteredcities = array();
        var state = $('#states').val();
    
        var keywords = [state];
        
        var regex = new RegExp(keywords.join("|"));
        
        filteredcities = $.grep(citieslist, function(s) { return s.match(regex) });  

        alert(filteredcities);   
    

        $.each(filteredcities, function(key, value) {   
            $('.cities')
                .append($("<option></option>")
                        .attr("value",value)
                        .text(value)); 
        });

    });
    */
   
    // Get value of one item in an array
    function getArritem(arrayname,itemname){
        if( itemname in arrayname ) {
            return arrayname[itemname]
        }
    }

    $("#payform").submit(function(e){


            e.preventDefault(); // avoid to execute the actual submit of the form.
        
            var form = $(this);
            
            $.ajax({
                   type: "POST",

                   url: "/users/paymentconfirmation",
                   data: form.serialize(), // serializes the form's elements.
                   success: function(data)
                   {
                       alert(data); // show response from the php script.
                   }
                 });
    });

    /* Read Message
    $(".readmsg").click(function(){

            var form = $(this);
            const msgid = this.id;

            $.ajax({
                type: "POST",

                url: "/users/message/"+msgid,
                dataType: 'text',
                success: function(msgdata)
                {
                    $("#msgsubject").html(msgdata.subject);                   
                    $("#msgmessage").html(msgdata.message);
                    $("#msgemail").html(msgdata.email);
                }
                });
    });
    */

    $("#agent_form").fadeOut();
    $(".msgbody").hide();

    $("#contact_agent").click(function(){
        $("#agent_form").toggle();
    });

});

$(document).on('click', '.removebtn', function () {
    $(this).parent('div').fadeOut();
});

function adjustsliderRange(){
    var minprice = $("#minprice").val();
    var maxprice = $("#maxprice").val();

    $("#price-range").attr('data-slider-min', minprice);
    $("#price-range").slider('data-slider-max', maxprice);
    $("#price-range").slider('refresh');
}

function payWithPaystack(){
    var pay_amount = $('#pay_amount').val();
    var handler = PaystackPop.setup({
      key: 'pk_test_668a3e096c8d718e229c8f3ef7a1d262caffc0e1',
      email: 'coinmacsms@gmail.com',
      amount: pay_amount+'00',
      currency: "NGN",
      ref: ''+Math.floor((Math.random() * 1000000000) + 1), 
      // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      metadata: {
         custom_fields: [
            {
                display_name: "Payment for Property",
                variable_name: "mobile_number",
                value: "+2348012345678"
            }
         ]
      },
      callback: function(response){
          alert('success. transaction ref is ' + response.reference);
      },
      onClose: function(){
          alert('window closed');
      }
    });
    handler.openIframe();
}

function showmsgBody(msgid){
    const msgbody = $("#"+msgid).data('msgbody');
    const msgsubject = $("#"+msgid).data('msgsubject');
    const receiverid = $("#"+msgid).data('receiverid');
    
    $("#msgmessage").html(msgbody);
    $("#msgsubject").html(msgsubject);
    $("#replylink").attr("href", "/users/reply/"+msgid+"/"+msgsubject+"/"+receiverid)
    $('#msgModal').modal('show');
}
  
// Initializing WOW.JS
new WOW().init();




