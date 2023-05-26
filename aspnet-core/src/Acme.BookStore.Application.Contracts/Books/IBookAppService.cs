using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Acme.BookStore.Books
{
    public interface IBookAppService : ICrudAppService<  //定义为 CRUD 方法
        BookDto,    //用于展示书籍
        Guid,       //Book 的主键类型
        PagedAndSortedResultRequestDto, //用于分页和排序
        CreateUpdateBookDto>    //用于创建/更新书籍信息
    {

    }
}
