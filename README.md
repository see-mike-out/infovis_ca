Specification

### Pages
- signin
- lists
- single coding page (should duplicate sub-forms)

### DB Structure
### users
{
  signin_id: xxxx,
  signin_password: xxxx,
  signin_log: [dates, ...]
}
#### db: samples
{
  id: n-xxx-n-xxxx,
  url: http://~,
  subvis: n,
  title: xxxx,
  is_coded: [
    {name: xxxx, date: yyyy-mm-dd hh:mm:ss}, ...
  ]
}
#### coding data
{
  id: n-xxx-n-xxxx, //identifier 1
  coder: xxxx, // identifier 2
  date: yyyy-mm-dd hh:mm:ss,
  code_article: [
    {term: xxxx, code: xxxx}, ...
  ],
  code_subvis: [
    {order: n, code_data: [
      {term: xxxx, code: xxxx}, ...
    ]}, ...
  ]
}