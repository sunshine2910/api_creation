class PaginationDTO {
  constructor(items, totalCount, req) {
    this.items = items;
    this.totalCount = totalCount;
    this.req = req;
  }

  toJSON() {
    const page = parseInt(this.req.query.page) || 1;
    const limit = parseInt(this.req.query.limit) || 30;
    const lastPage = Math.ceil(this.totalCount / limit) + 1;
    const params = new URLSearchParams(this.req.query);
    params.delete("page");
    const result = {
      items: this.items,
      _links: {
        first: {
          href: `${this.req.protocol}://${this.req.get("host")}${
            this.req.baseUrl
          }?${params.toString()}&page=1`,
        },
        last: {
          href: `${this.req.protocol}://${this.req.get("host")}${
            this.req.baseUrl
          }?${params.toString()}&page=${lastPage}`,
        },
      },
    };
    if (page > 1) {
      result._links.prev = {
        href: `${this.req.protocol}://${this.req.get("host")}${
          this.req.baseUrl
        }?${params.toString()}&page=${page - 1}`,
      };
    }
    if (page < lastPage) {
      result._links.next = {
        href: `${this.req.protocol}://${this.req.get("host")}${
          this.req.baseUrl
        }?${params.toString()}&page=${page + 1}`,
      };
    }

    return result;
  }
}

module.exports = PaginationDTO;
