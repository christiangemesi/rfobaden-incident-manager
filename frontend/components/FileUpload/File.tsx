function File() {

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <form>
      <input type="file" name="picture" />
      <button> Submit</button>
    </form>
  )
}

export default File