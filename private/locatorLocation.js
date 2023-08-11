export class Life360 {
  constructor(url, email, password, circle) {
    this.email = email;
    this.password = password;
    this.circle = circle;
    this.url = url + "/";
  }

  async init() {
    this.auth = await request(this.url + "oauth2/token.json", {
      grant_type: "password",
      username: this.email,
      password: this.password,
    });

    console.log(
      "Authorized as",
      this.auth.user.firstName,
      this.auth.user.lastName
    );
  }

  async listCircles() {
    let circles = await request(
      this.url + "circles",
      {},
      this.auth.access_token,
      "GET"
    );
    return circles.circles;
  }

  async getCircle(circleId) {
    let circle = await request(
      this.url + "circles/" + circleId,
      {},
      this.auth.access_token,
      "GET"
    );

    return circle;
  }

  async getMemberPosition(circleId, memberId) {
    /*let f = new URLSearchParams();
    f.append("type", "location");

    console.log(
      await request(
        this.url + "circles/" + circleId + "/members/" + memberId + "/request",
        {
          type: "location",
        },
        this.auth,
        "POST",
        f
      )
    );*/

    let members = (
      await request(
        this.url + "circles/" + circleId + "/members",
        {},
        this.auth.access_token,
        "GET"
      )
    ).members;

    for (let member of members) {
      if (member.id == memberId) return member.location;
    }
  }
}

const request = async (url, body, auth, method = "POST", form) => {
  return await (
    await fetch(url, {
      body: method == "POST" ? (form ? form : JSON.stringify(body)) : null,
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Application": "life360-web-client",
        authorization: auth
          ? "Bearer " + auth
          : "Basic U3dlcUFOQWdFVkVoVWt1cGVjcmVrYXN0ZXFhVGVXckFTV2E1dXN3MzpXMnZBV3JlY2hhUHJlZGFoVVJhZ1VYYWZyQW5hbWVqdQ==",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
        charset: "UTF-8",
      },
    })
  ).json();
};
