/*<copyright file="OrlfInfoControllerTests.cs" company="Korn Ferry">
    Author: Korn Ferry. Intelligency Cloud 2.0
    Copyright © 2022 Korn Ferry. All rights reserved.
  </copyright>
 */

using ic2.service.common.core.BLL.Interfaces;
using ic2.service.common.core.Controllers;
using ic2.service.common.core.DAL.Interfaces;
using ic2.service.common.core.DTO;
using ic2.service.common.core.DTO.Axon;
using ic2.service.common.core.Helper;
using ic2.service.common.core.Mapping.Axon;
using ic2.service.common.core.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace ic2.service.common.core.UnitTests.CoreAPITests.ControllersTests
{
    public class OrlfInfoControllerTests
    {
        private readonly Mock<IOrlfInfoBLL> _mockOrlf=new Mock<IOrlfInfoBLL>();
        private readonly Mock<ILogger<IOrlfInfoBLL>> _mockLogger = new  Mock<ILogger<IOrlfInfoBLL>>();
        private readonly OrlfInfoController orlfInfoController;

        public OrlfInfoControllerTests()
        {
            orlfInfoController = new OrlfInfoController(_mockOrlf.Object, _mockLogger.Object);
        }
    }
}
