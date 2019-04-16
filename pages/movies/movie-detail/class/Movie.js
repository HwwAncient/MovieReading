var util = require('../../../../utils/util.js')
class Movie {
  constructor(url) {
    this.url = url;
  }

  getMovieData(cb) {
    this.cb = cb;
    // 这里需要对processDoubanData函数进行bind操作再传入，使得该函数内部的this指向Movie对象。
    // 否则this则显示undefined
    // 传入函数时使用的this并不是调用该函数的调用方，这里使用this只是传入这个类的一个方法
    // this的值并不固定，随this所在的上下文的变化而变化
    // 用bind进行绑定肯定万无一失
    // 小程序的内部机制和网页开发还是有些许不同，理论不能完全照搬
    util.http(this.url, this.processDoubanData.bind(this));
  }

  processDoubanData(data) {
    if (!data) {
      return; 
    }
    var director = {
      avatar: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large

      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join("、"),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    }
    this.cb(movie);
  }
}

export { Movie }